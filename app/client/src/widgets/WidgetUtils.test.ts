import { ButtonVariantTypes } from "components/constants";
import { getTheme, ThemeMode } from "selectors/themeSelectors";
import { escapeSpecialChars, sanitizeKey } from "./WidgetUtils";
import {
  getCustomTextColor,
  getCustomBackgroundColor,
  getCustomHoverColor,
} from "./WidgetUtils";

describe("validate widget utils button style functions", () => {
  const theme = getTheme(ThemeMode.LIGHT);
  // validate getCustomTextColor function
  it("getCustomTextColor - validate empty or undefined background color", () => {
    // background color is undefined
    const result = getCustomTextColor(theme);
    expect(result).toStrictEqual("#FFFFFF");

    // background color is empty string
    const backgroundColor = "";
    const expected = "#FFFFFF";
    const result2 = getCustomTextColor(theme, backgroundColor);
    expect(result2).toStrictEqual(expected);
  });

  it("getCustomTextColor - validate text color in case of dark or light background color", () => {
    // background color is dark
    const blueBackground = "#3366FF";
    const expected1 = "#FFFFFF";
    const result1 = getCustomTextColor(theme, blueBackground);
    expect(result1).toStrictEqual(expected1);

    // background color is light
    const yellowBackground = "#FFC13D";
    const expected2 = "#333";
    const result2 = getCustomTextColor(theme, yellowBackground);
    expect(result2).toStrictEqual(expected2);
  });

  // validate getCustomBackgroundColor function
  it("getCustomBackgroundColor - validate empty or undefined background color", () => {
    const expected = "none";
    const result = getCustomBackgroundColor();
    expect(result).toStrictEqual(expected);
  });

  it("getCustomBackgroundColor - validate background color with primary button variant", () => {
    const backgroundColor = "#03b365";
    const expected = "#03b365";
    const result = getCustomBackgroundColor(
      ButtonVariantTypes.PRIMARY,
      backgroundColor,
    );
    expect(result).toStrictEqual(expected);
  });

  it("getCustomBackgroundColor - validate background color with secondary button variant", () => {
    const backgroundColor = "#03b365";
    const expected = "none";
    const result = getCustomBackgroundColor(
      ButtonVariantTypes.SECONDARY,
      backgroundColor,
    );
    expect(result).toStrictEqual(expected);
  });

  // validate getCustomHoverColor function
  it("getCustomHoverColor - validate empty or undefined background color or variant", () => {
    // background color and variant is both are undefined
    const expected = "#00693B";
    const result = getCustomHoverColor(theme);
    expect(result).toStrictEqual(expected);

    // variant is undefined
    const backgroundColor = "#03b365";
    const expected1 = "#028149";
    const result1 = getCustomHoverColor(theme, undefined, backgroundColor);
    expect(result1).toStrictEqual(expected1);
  });

  // validate getCustomHoverColor function
  it("getCustomHoverColor - validate hover color for different variant", () => {
    const backgroundColor = "#03b365";
    // variant : PRIMARY
    const expected1 = "#028149";
    const result1 = getCustomHoverColor(
      theme,
      ButtonVariantTypes.PRIMARY,
      backgroundColor,
    );
    expect(result1).toStrictEqual(expected1);

    // variant : PRIMARY without background
    const expected2 = theme.colors.button.primary.primary.hoverColor;
    const result2 = getCustomHoverColor(theme, ButtonVariantTypes.PRIMARY);
    expect(result2).toStrictEqual(expected2);

    // variant : SECONDARY
    const expected3 = "#85fdc8";
    const result3 = getCustomHoverColor(
      theme,
      ButtonVariantTypes.SECONDARY,
      backgroundColor,
    );
    expect(result3).toStrictEqual(expected3);

    // variant : SECONDARY without background
    const expected4 = theme.colors.button.primary.secondary.hoverColor;
    const result4 = getCustomHoverColor(theme, ButtonVariantTypes.SECONDARY);
    expect(result4).toStrictEqual(expected4);

    // variant : TERTIARY
    const expected5 = "#85fdc8";
    const result5 = getCustomHoverColor(
      theme,
      ButtonVariantTypes.TERTIARY,
      backgroundColor,
    );
    expect(result5).toStrictEqual(expected5);

    // variant : TERTIARY without background
    const expected6 = theme.colors.button.primary.tertiary.hoverColor;
    const result6 = getCustomHoverColor(theme, ButtonVariantTypes.TERTIARY);
    expect(result6).toStrictEqual(expected6);
  });

  it("validate escaping special characters", () => {
    const testString = `a\nb\nc
hello! how are you?
`;
    const result = escapeSpecialChars(testString);
    const expectedResult = "a\nb\nc\nhello! how are you?\n";
    expect(result).toStrictEqual(expectedResult);
  });
});

describe(".sanitizeKey", () => {
  it("returns sanitized value when passed a valid string", () => {
    const inputAndExpectedOutput = [
      ["lowercase", "lowercase"],
      ["__abc__", "__abc__"],
      ["lower_snake_case", "lower_snake_case"],
      ["UPPER_SNAKE_CASE", "UPPER_SNAKE_CASE"],
      ["PascalCase", "PascalCase"],
      ["camelCase", "camelCase"],
      ["lower-kebab-case", "lower_kebab_case"],
      ["UPPER_KEBAB-CASE", "UPPER_KEBAB_CASE"],
      ["Sentencecase", "Sentencecase"],
      ["", "_"],
      ["with space", "with_space"],
      ["with multiple  spaces", "with_multiple__spaces"],
      ["with%special)characters", "with_special_characters"],
      ["with%$multiple_spl.)characters", "with__multiple_spl__characters"],
      ["1startingWithNumber", "_1startingWithNumber"],
    ];

    inputAndExpectedOutput.forEach(([input, expectedOutput]) => {
      const result = sanitizeKey(input);
      expect(result).toEqual(expectedOutput);
    });
  });

  it("returns sanitized value when valid string with existing keys and reserved keys", () => {
    const existingKeys = [
      "__id",
      "__restricted__",
      "firstName1",
      "_1age",
      "gender",
      "poll123",
      "poll124",
      "poll125",
      "address_",
    ];

    const inputAndExpectedOutput = [
      ["lowercase", "lowercase"],
      ["__abc__", "__abc__"],
      ["lower_snake_case", "lower_snake_case"],
      ["UPPER_SNAKE_CASE", "UPPER_SNAKE_CASE"],
      ["PascalCase", "PascalCase"],
      ["camelCase", "camelCase"],
      ["lower-kebab-case", "lower_kebab_case"],
      ["UPPER_KEBAB-CASE", "UPPER_KEBAB_CASE"],
      ["Sentencecase", "Sentencecase"],
      ["", "_"],
      ["with space", "with_space"],
      ["with multiple  spaces", "with_multiple__spaces"],
      ["with%special)characters", "with_special_characters"],
      ["with%$multiple_spl.)characters", "with__multiple_spl__characters"],
      ["1startingWithNumber", "_1startingWithNumber"],
      ["1startingWithNumber", "_1startingWithNumber"],
      ["firstName", "firstName"],
      ["firstName1", "firstName2"],
      ["1age", "_1age1"],
      ["address&", "address_1"],
      ["%&id", "__id1"],
      ["%&restricted*(", "__restricted__1"],
      ["poll130", "poll130"],
      ["poll124", "poll126"],
      ["हिन्दि", "xn__j2bd4cyac6f"],
      ["😃", "xn__h28h"],
    ];

    inputAndExpectedOutput.forEach(([input, expectedOutput]) => {
      const result = sanitizeKey(input, {
        existingKeys,
      });
      expect(result).toEqual(expectedOutput);
    });
  });
});
