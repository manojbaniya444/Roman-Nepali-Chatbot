## NER Labeling Tool

> This Code Need Refactor, but

- First paste the sentences in the `**data/sentences.txt**` directory where each new line is a new sentence.
- Then run the `**app.py**` script to run the app then label the entity.
- Then after getting the labeled data in `**data/labeled_data.json**` run the script `**crf_aligner**` to get the aligned pair of tuple which will be saved in `**data/aligned_data**` JSON file.
- Then we can load the json file and get the array tupled items when we want to use to train the model.

This is step for labeling the entity for NER and dataset preparation to train the NER Model like CRF, etc.