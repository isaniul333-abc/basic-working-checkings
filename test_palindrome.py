from palindrome import is_palindrome


def test_valid_palindrome():

    assert is_palindrome("madam") == True


def test_non_palindrome():

    assert is_palindrome("python") == False


def test_mixed_case_palindrome():

    assert is_palindrome("Racecar") == True