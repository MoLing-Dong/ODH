/* global api */
class FinnZhDictionary {
  constructor() {
    this.apiUrl = "https://www.sanakirja.fi/api/search/api/sk/search";
    this.headers = {
      Accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6dHJ1ZSwiaWF0IjoxNzIyODI4NDQxLCJqdGkiOiI2MGRmZDU1Yi00MmE3LTQ5MTQtYmYxNy0wNGVkYmMxMjM1OTQiLCJ0eXBlIjoiYWNjZXNzIiwiaWRlbnRpdHkiOnsidXNlcl9pZCI6ImU0M2VkNjg3LTg3MTQtNDY4My04MTQwLWMzNzkwNWM5ZjUzOCIsImNsaWVudCI6IkdVNzdSeTRMWThhOEc3NElCZzAzQm5WMDhBNTQ2azY1IiwiY2xpZW50X25hbWUiOiJzYW5ha2lyamEifSwibmJmIjoxNzIyODI4NDQxLCJleHAiOjE3MjI4MzIwNDEsInVzZXJfY2xhaW1zIjp7InN0YXRzVXNlclR5cGUiOiJmcmVlIn19.K9XX_xxtJkrbQrb-Hz4sIsU5mM1wUkPPQCBD6wJmMOY",
      "Content-Type": "application/json",
      Cookie: "xxoo-tmp=en-US",
      "Ngsw-Bypass": "true",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    };
  }

  async displayName() {
    let locale = await api.locale();
    if (locale.indexOf("CN") != -1) return "朗文英汉5词典(MDX)";
    if (locale.indexOf("TW") != -1) return "朗文英英5词典(MDX)";
    return "enen_LDOCE5(MDX)";
  }

  async findTerm(word) {
    const params = {
      keyword: word,
      keyword_language: "fi",
      target_language: "zh",
      search_service: "ss",
      dictionaries: "default",
      mt_fallback: "true",
      user_data: "true",
      entry_langs: "true",
    };

    const urlParams = new URLSearchParams(params).toString();
    const url = `${this.apiUrl}?${urlParams}`;

    try {
      const response = await api.fetch(url, {
        headers: this.headers,
      });

      if (response.status !== 200) {
        throw new Error(
          `Failed to fetch data. Status code: ${response.status}`
        );
      }

      const data = await response.json();
      console.log(data);

      const translations = [];

      data.data.forEach((entry) => {
        entry.senses.forEach((sense) => {
          sense.examples.forEach((example) => {
            example.translations.forEach((translation) => {
              translations.push({
                translationText: translation.text,
                ipa:
                  translation.ipa && translation.ipa.length > 0
                    ? translation.ipa[0].ipa
                    : "",
                audioUrl: translation.audio,
              });
            });
          });
        });
      });

      return translations;
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }
}

// Example usage:
const dictionary = new FinnZhDictionary();
dictionary
  .findTerm("nainen")
  .then((translations) => {
    translations.forEach((translation) => {
      console.log(`Translation: ${translation.translationText}`);
      console.log(`IPA: ${translation.ipa}`);
      console.log(`Audio URL: ${translation.audioUrl}`);
      console.log(); // 分隔翻译
    });
  })
  .catch((error) => {
    console.error(error);
  });
