from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def test_wikipedia():

    driver = webdriver.Chrome()

    driver.get("https://www.wikipedia.org")

    search = driver.find_element(
        By.ID,
        "searchInput"
    )

    search.send_keys("Bangladesh")

    driver.find_element(
        By.CSS_SELECTOR,
        "button[type='submit']"
    ).click()

    time.sleep(3)

    print(driver.title)

    assert "Bangladesh" in driver.title

    driver.quit()