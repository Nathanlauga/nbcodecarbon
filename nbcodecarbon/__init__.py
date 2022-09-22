import threading
import time
import datetime
from codecarbon import OfflineEmissionsTracker
import logging

stop_thread = False
logger = logging.getLogger("codecarbon")

def save_codecarbon_tracker():
    global tracker

    # TODO
    logger.setLevel(50)
    emissions = tracker.flush()

    with open("test.txt", "a") as f:
        d = datetime.datetime.today().strftime("%Y/%m/%d %X")
        f.write(f"{d} - {emissions}\n")


def launch_thread_saving(interval=5):
    # stop_thread will be set as false in main.js
    global stop_thread
    while True:
        time.sleep(interval)

        if stop_thread:
            break

        save_codecarbon_tracker()

# TODO remove logs
tracker = OfflineEmissionsTracker(country_iso_code="FRA")
tracker.start()
logger.setLevel(50)
save_thread = threading.Thread(target=launch_thread_saving)
