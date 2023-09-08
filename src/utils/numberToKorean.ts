export function numberToKorean(number: number) {
  const inputNumber = number < 0 ? 0 : number
  const unitWords = ['만', '억', '조', '경']
  const splitUnit = 10000
  const splitCount = unitWords.length
  const resultArray: number[] = []
  let resultString = ''

  for (let i = 0; i < splitCount; i++) {
    let unitResult =
      (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i)
    unitResult = Math.floor(unitResult)
    if (unitResult > 0) {
      resultArray[i] = unitResult
    }
  }

  for (let i = 0; i < resultArray.length; i++) {
    if (!resultArray[i]) continue
    resultString = String(resultArray[i]) + unitWords[i] + resultString
  }

  return resultString
}
