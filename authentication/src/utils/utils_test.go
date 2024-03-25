package utils

import (
	"testing"
)

func TestRemoveSpacesTabsNewlines(t *testing.T) {
	tests := []struct {
		name   string
		input  string
		output string
	}{
		{
			name:   "NoSpacesTabsNewlines",
			input:  "HelloWorld",
			output: "HelloWorld",
		},
		{
			name:   "WithSpacesTabsNewlines",
			input:  "Hello\tWorld\n",
			output: "HelloWorld",
		},
		{
			name:   "EmptyInput",
			input:  "",
			output: "",
		},
		{
			name:   "OnlySpacesTabsNewlines",
			input:  " \t\n",
			output: "",
		},
		{
			name:   "MixedInput",
			input:  "Hello\t World\n",
			output: "HelloWorld",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := RemoveSpacesTabsNewlines(tt.input)
			if result != tt.output {
				t.Errorf("Expected %q, but got %q", tt.output, result)
			}
		})
	}
}
