codecarbon_default_conf = {
    "measure_power_secs": 15,
    "save_to_file": True,
    "log_level": "warning",
    "output_dir": ".",
    "output_file": "emissions.csv",
    "on_csv_write": "append", # TODO : check why 'update' raise an error
    "country_iso_code": "FRA",
}
