const htmlsTagsData = {
  div: ['<div', '</div>'],
  paragraph: ['<p', '</p>'],
  body: ['<body', '</body>'],
  link: ['<a', '</a>'],
  span: ['<span', '</span>'],
  strong: ['<strong', '</strong>'],
  head: ['<head', '</head>'],
  title: ['<title', '</title>'],
  h1: ['<h1', '</h1>'],
  h2: ['<h2', '</h2>'],
  h3: ['<h3', '</h3>'],
  h4: ['<h4', '</h4>'],
  h5: ['<h5', '</h5>'],
  h6: ['<h6', '</h6>'],
};
export const convertHtmlToString = (html) => {
  let newHtml = html;
  let foundTags = 0;
  newHtml = newHtml.replace(new RegExp('<br/>', 'g'), '\n');
  newHtml = newHtml.replace(new RegExp('<br />', 'g'), '\n');
  newHtml = newHtml.replace(new RegExp('&nbsp;', 'g', ' '));
  Object.keys(htmlsTagsData).forEach((key) => {
    const numOfTagOccurences = (newHtml.match(new RegExp(htmlsTagsData[`${key}`][0], 'g')) || [])
      .length;
    if (numOfTagOccurences === 0) {
      return null;
    }
    const openTagStringToRemove = newHtml.slice(
      newHtml.indexOf(htmlsTagsData[key][0]),
      newHtml.indexOf('>') + 1,
    );

    const endStringTagToRemove = htmlsTagsData[`${key}`][1];
    newHtml = newHtml.replace(new RegExp(openTagStringToRemove, 'g'), '');
    newHtml = newHtml.replace(new RegExp(endStringTagToRemove, 'g'), '\n\n');

    if (numOfTagOccurences > 0) {
      foundTags += 1;
    }
  });
  if (foundTags === 0) {
    return newHtml;
  }
  return convertHtmlToString(newHtml);
};
