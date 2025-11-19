import time
import json
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchWindowException, WebDriverException
import undetected_chromedriver as uc


# CONFIG
TARGET_URL = 'https://www.eventbrite.com/d/ca--los-angeles/all-events/'
MAX_WAIT_TIME = 30
STABLE_COUNT_RETRIES = 3  # number of checks to consider the list 'stable'
SCROLL_PAUSE = 1.0

def init_driver():
    chrome_options = webdriver.ChromeOptions()
    # chrome_options.add_argument("--headless=new")  # try headless only after debugging
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36")
    chrome_options.add_argument("--window-size=1600,900")
    # Try a different page load strategy if you want: 'normal' (default), 'eager', or 'none'
    chrome_options.page_load_strategy = 'eager'
    import undetected_chromedriver as uc

# Create driver (do NOT run headless for now)
    driver = uc.Chrome(
        headless=False,  # set True later IF captcha is not triggered
        use_subprocess=True
    )

    driver.get("https://www.eventbrite.com/d/ca--los-angeles/all-events/")

    return driver

def accept_cookie_banner(driver):
    # Try several common cookie button texts / attributes
    candidates = [
        "//button[contains(., 'Accept')]",
        "//button[contains(., 'agree')]",
        "//button[contains(., 'Accept Cookies')]",
        "//button[contains(@aria-label, 'accept')]",
        "//button[contains(@class,'cookie') or contains(@class,'Cookie')]"
    ]
    for xp in candidates:
        try:
            btn = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.XPATH, xp)))
            btn.click()
            print("Clicked cookie/consent button:", xp)
            time.sleep(1)
            return True
        except Exception:
            continue
    return False

def wait_for_event_list_ready(driver):
    # Flexible selectors: data-testid, generic list item, or article cards
    possible_xpaths = [
        "//main//section[@data-testid='search-results-panel']//li",
        "//ul[contains(@class,'search-main-content') or contains(@class,'search-results')]/li",
        "//div[contains(@data-spec,'event-card') or contains(@class,'eds-event-card-content__content')]",
        "//li[contains(@class,'search-event-card-wrapper')]",
    ]
    for xp in possible_xpaths:
        try:
            WebDriverWait(driver, MAX_WAIT_TIME).until(
                EC.presence_of_element_located((By.XPATH, xp))
            )
            # If present, return the xpath we found so caller can use it
            return xp
        except TimeoutException:
            continue
    # nothing found
    raise TimeoutException("No known event list selector matched within timeout.")

def scroll_to_load_all(driver, item_xpath):
    # Keep scrolling down the container until number of items stabilizes
    last_count = 0
    stable = 0
    scroll_attempts = 0
    while stable < STABLE_COUNT_RETRIES and scroll_attempts < 50:
        items = driver.find_elements(By.XPATH, item_xpath)
        count = len(items)
        if count == last_count:
            stable += 1
        else:
            stable = 0
            last_count = count

        # scroll down a bit (page-level)
        driver.execute_script("window.scrollBy(0, window.innerHeight * 0.9);")
        time.sleep(SCROLL_PAUSE)
        scroll_attempts += 1
    print(f"Scrolling finished. Found {last_count} items after {scroll_attempts} scrolls.")
    return driver.find_elements(By.XPATH, item_xpath)

def extract_events_from_elements(event_elements):
    events = []
    for i, event in enumerate(event_elements):
        try:
            # title/link: try a few fallbacks
            title = ""
            link = ""
            try:
                a = event.find_element(By.XPATH, ".//a[@data-testid='event-card-link' or contains(@href,'/e/')]")
                title = a.text.strip() or a.get_attribute('aria-label') or ""
                link = a.get_attribute('href') or ""
            except Exception:
                # fallback: any anchor inside
                try:
                    a2 = event.find_element(By.XPATH, ".//a")
                    title = a2.text.strip() or ""
                    link = a2.get_attribute('href') or ""
                except:
                    pass

            # id from URL
            match = re.search(r'/e/(\d+)', link or "")
            event_id = match.group(1) if match else "N/A"

            # date
            date_text = "Date not found"
            try:
                date_el = event.find_element(By.XPATH, ".//p[@data-testid='event-card-date'] | .//time")
                date_text = date_el.text.strip()
            except Exception:
                pass

            # location
            location = "Location not found"
            try:
                loc_el = event.find_element(By.XPATH, ".//p[@data-testid='event-card-venue'] | .//div[contains(@class,'venue')]")
                location = loc_el.text.strip()
            except Exception:
                pass

            events.append({
                'event_id': event_id,
                'title': title,
                'date': date_text,
                'location': location,
                'link': link
            })
        except Exception as e:
            print(f"Warning: failed to parse event #{i+1}: {e}")
            continue
    return events

def scrape_eventbrite_events(url):
    driver = None
    events_data = []
    try:
        driver = init_driver()
        print("Navigating to:", url)
        driver.get(url)
        print("Page title:", driver.title)
        html = driver.page_source.lower()
        for kw in ["cloudflare", "captcha", "are you human", "access denied", "jschl", "verify", "cookie", "consent", "sign in", "login"]:
            if kw in html:
                print("Detected keyword in page:", kw)
        time.sleep(1.5)  # give initial JS a moment

        # Try to accept cookie / consent modal if present
        accept_cookie_banner(driver)

        # Wait until we find a list selector that works
        try:
            item_xpath = wait_for_event_list_ready(driver)
            print("Using selector:", item_xpath)
        except TimeoutException as e:
            # Save the page source for debugging
            with open("eventbrite_debug_page.html", "w", encoding="utf-8") as f:
                f.write(driver.page_source)
            raise

        # Scroll to load lazy items and get stable list
        event_elements = scroll_to_load_all(driver, item_xpath)

        if not event_elements:
            print("No event elements found after scrolling.")
        else:
            print(f"Found {len(event_elements)} potential events. Extracting...")
            events_data = extract_events_from_elements(event_elements)

    except TimeoutException as te:
        print("TimeoutException:", te)
        # optionally save page source to debug
        if driver:
            with open("eventbrite_timeout_snapshot.html", "w", encoding="utf-8") as f:
                f.write(driver.page_source)
            print("Saved snapshot to eventbrite_timeout_snapshot.html for debugging.")
    except NoSuchWindowException as ne:
        print("NoSuchWindowException (window closed):", ne)
    except WebDriverException as we:
        print("WebDriverException:", we)
    except Exception as e:
        print("Unexpected error:", e)
    finally:
        if driver:
            driver.quit()
            print("Driver quit.")

    # Save JSON if we have results
    if events_data:
        fname = "eventbrite_events.json"
        with open(fname, 'w', encoding='utf-8') as f:
            json.dump(events_data, f, ensure_ascii=False, indent=4)
        print(f"Saved {len(events_data)} events to {fname}")
    else:
        print("No events extracted.")

if __name__ == "__main__":
    scrape_eventbrite_events(TARGET_URL)



# pip install requests
# import requests, json

# TOKEN = "OOV2GOHCPPCCPQGUOA4B"  # replace
# OUTFILE = "eventbrite_api_events.json"

# headers = {"Authorization": f"Bearer {TOKEN}"}
# params = {
#     "location.address": "Los Angeles, CA",
#     "location.within": "30mi",
#     "expand": "venue",
#     "page": 1
# }

# all_events = []
# while True:
#     r = requests.get("https://www.eventbriteapi.com/v3/events/search/",
#                      headers=headers, params=params, timeout=30)
#     if r.status_code != 200:
#         print("Error", r.status_code, r.text)
#         break
#     data = r.json()
#     events = data.get("events", [])
#     for e in events:
#         all_events.append({
#             "event_id": e.get("id"),
#             "title": e.get("name", {}).get("text"),
#             "start": e.get("start", {}).get("local"),
#             "end": e.get("end", {}).get("local"),
#             "url": e.get("url"),
#             "venue_id": e.get("venue_id")
#         })
#     pagination = data.get("pagination", {})
#     if not pagination.get("has_more_items"):
#         break
#     params["page"] += 1

# with open(OUTFILE, "w", encoding="utf-8") as f:
#     json.dump(all_events, f, ensure_ascii=False, indent=2)
# print(f"Saved {len(all_events)} events to {OUTFILE}")
