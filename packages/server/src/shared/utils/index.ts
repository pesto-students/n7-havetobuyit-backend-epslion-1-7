import fs from 'fs';
import path from 'path';
import {
  EmailVerificationTemplate,
  HtmlTemplateLinkPlaceholder,
  ResetPasswordTemplate,
} from '../../shared/config/constants';

/** Formats date from YYYYMMDD to YYYY-MM-DD */
export const formatDate = (value: string) => {
  const year = value.substr(0, 4);
  const month = value.substr(4, 2);
  const day = value.substr(6, 2);
  return year + '-' + month + '-' + day;
};

export const getOrReadFile = (() => {
  const pathMap = new Map<string, Buffer>();
  return (filePath: string) => {
    if (!pathMap.has(filePath)) {
      const file = fs.readFileSync(path.resolve(__dirname, filePath));
      pathMap.set(filePath, file);
      return file;
    }
    return pathMap.get(filePath);
  };
})();

export const buildHtmlFromTemplate = (url: string, templatePath: string) =>
  getOrReadFile(templatePath)
    .toString()
    .replace(HtmlTemplateLinkPlaceholder, url);

export const buildResetPasswordMail = (url: string) =>
  buildHtmlFromTemplate(url, resolveTemplatePath(ResetPasswordTemplate));

export const buildEmailVerificationMail = (url: string) =>
  buildHtmlFromTemplate(url, resolveTemplatePath(EmailVerificationTemplate));

export const resolveTemplatePath = (filename: string) => {
  switch (process.env.NODE_ENV) {
    case 'test':
      return '../../templates/' + filename;
    case 'dev':
      return '../../../src/templates/' + filename;
    default:
      // Production
      return '../../templates/' + filename;
  }
};
