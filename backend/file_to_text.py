import cv2
import easyocr
import nltk
from matplotlib import pyplot as plt

# ---------------- NLTK Setup ----------------
nltk.download('punkt')
from nltk.tokenize import word_tokenize

def extract_tokens(image_path, show_image=False):
    """
    Extract tokens and raw text from a resume image using EasyOCR.
    
    Args:
        image_path (str): Path to the resume image.
        show_image (bool): If True, display image with OCR boxes.
    
    Returns:
        tokens (list): Tokenized words from the resume.
        all_text (str): Complete extracted text.
    """

    # ---------------- Load Image ----------------
    img = cv2.imread(image_path)

    # ---------------- EasyOCR Reader ----------------
    reader = easyocr.Reader(['en'], gpu=False)  # CPU mode
    results = reader.readtext(img)

    # ---------------- Extract Text ----------------
    detected_text = []
    for (bbox, text, prob) in results:
        if prob > 0.5:  # filter by confidence
            detected_text.append(text.strip())
            if show_image:  # draw boxes only if asked
                (top_left, top_right, bottom_right, bottom_left) = bbox
                top_left = tuple(map(int, top_left))
                bottom_right = tuple(map(int, bottom_right))
                cv2.rectangle(img, top_left, bottom_right, (0, 255, 0), 2)
                cv2.putText(img, text, (top_left[0], top_left[1]-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)

    # ---------------- Deduplicate ----------------
    detected_text = list(dict.fromkeys(detected_text))

    # ---------------- Join All Text ----------------
    all_text = " ".join(detected_text)

    # ---------------- Tokenization ----------------
    tokens = word_tokenize(all_text.lower())  # lowercase for matching

    # ---------------- Show Image (optional) ----------------
    if show_image:
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        plt.figure(figsize=(12, 8))
        plt.imshow(img_rgb)
        plt.axis('off')
        plt.show()

    return tokens, all_text


# ---------------- Script Mode ----------------
if __name__ == "__main__":
    image_path = "Resumes/sample1.png"  # change path to your resume image
    tokens, text = extract_tokens(image_path, show_image=True)

    print("\n========= OCR Detected Text =========\n")
    print(text)

    print("\n========= Tokenized Words =========\n")
    print(tokens)
