def get_words(page, line):
    """
    Extract words from a line in a page.

    Args:
        page: The page object containing the line.
        line: The line object from which words are to be extracted.

    Returns:
        List of word objects with their content and confidence.
    """
    words = []
    for word in line.words:
        words.append({
            "content": word.content,
            "confidence": word.confidence
        })
    return words
