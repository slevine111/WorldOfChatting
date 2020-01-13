import axios from 'axios'
import { load } from 'cheerio'

export interface ICountryAndLanguage {
  country: string
  language: string
}

const getData = (): Promise<CheerioStatic> => {
  return axios
    .get(
      'https://en.wikipedia.org/wiki/List_of_official_languages_by_country_and_territory'
    )
    .then(({ data }) => load(data))
}

const processDataIntoCountryAndLanguageArray = (
  $: CheerioStatic
): ICountryAndLanguage[] => {
  let countryAndLanguages: ICountryAndLanguage[] = []
  load($('table.wikitable').get(0))('tr').each((i, element) => {
    const country: string = load(element)('td:nth-of-type(1) a')
      .eq(0)
      .text()

    const languages: string = load(element)('td:nth-of-type(2)').text()
    const languagesArray: string[] = languages.split('\n')

    if (i >= 0 && country !== '') {
      const newEntries: ICountryAndLanguage[] = languagesArray
        .filter(
          el =>
            el !== '' &&
            el[0].search(/[A-Z]/) === 0 &&
            el.search(/[sS]ign [lL]anguage/) === -1
        )
        .map(
          (el: string): ICountryAndLanguage => {
            const myRegEx: RegExp = /^.+?(?= \(|\[)/
            return {
              country,
              language: myRegEx.exec(el) ? myRegEx.exec(el)![0] : el
            }
          }
        )
      countryAndLanguages = [...countryAndLanguages, ...newEntries]
    }
  })

  return countryAndLanguages
}

const scrapeAndProcessLanguageData = (): Promise<ICountryAndLanguage[]> => {
  return getData().then($ => processDataIntoCountryAndLanguageArray($))
}

export default scrapeAndProcessLanguageData
