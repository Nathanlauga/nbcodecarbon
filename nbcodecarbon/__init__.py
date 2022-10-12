import code
import threading
import time
import ast
from codecarbon import OfflineEmissionsTracker
import logging
from .default_conf import codecarbon_default_conf

stop_thread = False
logger = logging.getLogger("codecarbon")


def init_tracker(conf):
    conf = ast.literal_eval(conf)
    conf = {**codecarbon_default_conf, **conf}

    tracker = OfflineEmissionsTracker(**conf)

    # TODO map with measure_power_secs
    interval = 10

    def flush_tracker_thread():
        # stop_thread will be set as false in main.js
        global stop_thread
        while True:
            time.sleep(interval)

            if stop_thread:
                break

            tracker.flush()

    save_thread = threading.Thread(target=flush_tracker_thread)

    return tracker, save_thread
