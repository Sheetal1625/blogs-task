package utils

import "strings"

func RemoveSpacesTabsNewlines(input string) string {
	// Replace spaces, tabs, and newlines with empty strings
	output := strings.ReplaceAll(input, " ", "")
	output = strings.ReplaceAll(output, "\t", "")
	output = strings.ReplaceAll(output, "\n", "")
	return output
}
