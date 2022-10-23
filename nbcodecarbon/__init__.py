import code
import threading
import time
import ast
from codecarbon import OfflineEmissionsTracker
import logging
from .default_conf import codecarbon_default_conf

logger = logging.getLogger("codecarbon")


def init_tracker(conf):
    conf = ast.literal_eval(conf)
    conf = {**codecarbon_default_conf, **conf}

    tracker = OfflineEmissionsTracker(**conf)

    # TODO map with measure_power_secs
    interval = 10

    def flush_tracker_thread():
        while True:
            time.sleep(interval)

            if tracker._start_time is not None:
                tracker.flush()

    save_thread = threading.Thread(target=flush_tracker_thread)

    return tracker, save_thread
