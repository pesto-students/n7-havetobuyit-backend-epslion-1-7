import faker from 'faker';

export const getValidEmail = () => faker.internet.email();
export const getInvalidPassword = () => faker.datatype.string(5);
export const getValidLoginCredentials = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const getValidRegisterCredentials = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const TokenUrlLandmark = 'change/';

export const getTokenFromHTML = (
  html: string,
  tokenUrlLandmark: string = TokenUrlLandmark,
) => {
  // 8efba0ca - This string is present in data-test-id attribute of <a> element which contains token
  const urlStartIndex = html.indexOf('8efba0ca') + '8efba0ca"  href="'.length;
  let urlEndIndex = urlStartIndex;

  // Find ending double quote
  while (html[urlEndIndex] !== '"') {
    urlEndIndex += 1;
  }
  const url = html.slice(urlStartIndex, urlEndIndex);
  const indexOfToken = url.indexOf(tokenUrlLandmark) + tokenUrlLandmark.length;
  return url.slice(indexOfToken, url.length);
};
