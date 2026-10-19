import json
import argparse

parser = argparse.ArgumentParser(description="Strip reveiwer emails from prodcuct data.")
parser.add_argument("input", help="input JSON file")
parser.add_argument("output", help="output JSON file")
args = parser.parse_args()

with open(args.input) as f:
  data = json.load(f)
  for product in data['products']:
    for review in product['reviews']:
      # Remove PII from mock data, just as habit
      del review['reviewerEmail']

with open(args.output, 'x') as f:
  json.dump(data, f, indent=2)
