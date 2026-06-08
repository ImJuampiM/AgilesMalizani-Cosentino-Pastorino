import unittest
from string_calculator import add


class TestStringCalculator(unittest.TestCase):

    def test_empty_string_returns_zero(self):
        self.assertEqual(add(""), 0)

    def test_single_number_returns_value(self):
        self.assertEqual(add("1"), 1)
        self.assertEqual(add("5"), 5)
    
    def test_two_numbers_returns_sum(self):
        self.assertEqual(add("1,2"), 3)
        self.assertEqual(add("10,20"), 30)
    
    def test_multiple_numbers_returns_sum(self):
        self.assertEqual(add("1,2,3"), 6)
        self.assertEqual(add("1,2,3,4,5"), 15)

    def test_newline_as_separator(self):
        self.assertEqual(add("1\n2"), 3)

    def test_mixed_separators(self):
        self.assertEqual(add("1\n2,3"), 6)

    def test_negative_number_throws_exception(self):
        with self.assertRaises(Exception) as context:
            add("-1")
        self.assertEqual(str(context.exception), "negatives not allowed: -1")

    def test_negative_numbers_raise_exception(self):
        with self.assertRaises(ValueError) as context:
            add("1,-2,3")
        self.assertEqual(str(context.exception), "negatives not allowed: -2")

    def test_two_numbers_profe_example(self):
        self.assertEqual(add("4,2"), 6)

    def test_many_numbers_profe_example(self):
        self.assertEqual(add("1,2,3,5,8,13"), 32)

    def test_mixed_comma_and_newline_profe_example(self):
        self.assertEqual(add("1,2,4\n5,6"), 18)

    def test_custom_delimiter_semicolon(self):
        self.assertEqual(add("//;\n1;3;6;4"), 14)

    def test_custom_delimiter_pipe(self):
        self.assertEqual(add("//|\n1|3|6|4"), 14)

if __name__ == "__main__":
    unittest.main()
