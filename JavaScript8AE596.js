/* global api */
class finnZhDictionary {
  constructor(options) {
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
    //this.maxexample = options.maxexample || 2;
  }

  async displayName() {
    let locale = await api.locale();
    if (locale.includes("CN")) return "芬汉双解词典";
    if (locale.includes("TW")) return "芬漢雙解詞典";
    return "Finnish-Chinese Dictionary";
  }

  setOptions(options) {
    this.options = options;
    this.maxexample = options.maxexample;
  }

  async findTerm(word) {
    if (!word) return [];

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

    try {
      const response = await axios.get(this.apiUrl, {
        headers: this.headers,
        params,
      });
      if (response.status !== 200)
        throw new Error(
          `Failed to fetch data. Status code: ${response.status}`
        );

      const data = response.data.data;
      const translations = [];

      data.forEach((entry) => {
        const word = entry.index[0];
        const pos = entry.pos.join(", ");

        entry.senses.forEach((sense) => {
          const senseId = sense.id;
          const created = sense.created;

          sense.examples.forEach((example) => {
            const exampleText = example.text;
            const exampleCreated = example.created;

            example.translations.forEach((translation) => {
              translations.push({
                word,
                pos,
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
      throw new Error("Error fetching data: " + error);
    }
  }
}
