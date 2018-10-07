{"_id":"_design/author","_rev":"9-c8bc6e296cb0a08e6e3fc5eb762f99a8","lists":{"key":"function(head,req) { var row; start({ 'headers': { 'Content-Type': 'text/plain' } }); while(row = getRow()) { send(row.key + '\\n'); } }","triples":"function(head,req) { var row; start({ 'headers': { 'Content-Type': 'text/plain' } }); while(row = getRow()) { send(row.value); } }"},"views":{"DOI-WIKISPECIES":{"map":"\n// Output [WIKISPECIES author id, DOI] (or other identifier)\n// as prelude to linking author ids to article ids\n\nfunction(doc) {\n  if (doc.references) {\n    for (var i in doc.references) {\n       if (doc.references[i].csl) {\n       \tvar workId = null;\n       \t\n       \tif (doc.references[i].csl.DOI) {\n       \t\tworkId = doc.references[i].csl.DOI;\n       \t}\n       \n       \tif (workId) {\n           if (doc.references[i].csl.author) {\n              for (var j in doc.references[i].csl.author) {\n                if (doc.references[i].csl.author[j].WIKISPECIES) {\n                  emit(doc.references[i].csl.author[j].WIKISPECIES, workId);\n                  \n                  emit(doc.references[i].csl.DOI.toLowerCase(), [doc.references[i].csl.author[j].WIKISPECIES, doc.references[i].csl.author[j].literal, parseInt(j)+1]);\n                  \n                }\n              }\n           }\n         }\n         \n      }\n    }\n  }\n}"},"nt":{"map":"/*\n\nShared code\n\n\n*/\n//----------------------------------------------------------------------------------------\n// http://stackoverflow.com/a/25715455\nfunction isObject(item) {\n  return (typeof item === \"object\" && !Array.isArray(item) && item !== null);\n}\n\n//----------------------------------------------------------------------------------------\n// http://stackoverflow.com/a/21445415\nfunction uniques(arr) {\n  var a = [];\n  for (var i = 0, l = arr.length; i < l; i++)\n    if (a.indexOf(arr[i]) === -1 && arr[i] !== '')\n      a.push(arr[i]);\n  return a;\n}\n\n\n//----------------------------------------------------------------------------------------\n// Store a triple with optional language code\nfunction triple(subject, predicate, object, language) {\n  var triple = [];\n  triple[0] = subject;\n  triple[1] = predicate;\n  triple[2] = object;\n\n  if (typeof language === 'undefined') {} else {\n    triple[3] = language;\n  }\n\n  return triple;\n}\n\n//----------------------------------------------------------------------------------------\n// Enclose triple in suitable wrapping for HTML display or triplet output\nfunction wrap(s, html) {\n  if (s) {\n\n    if (s.match(/^(http|urn|_:)/)) {\n      s = s.replace(/\\\\_/g, '_');\n\n      // handle < > in URIs such as SICI-based DOIs\n      s = s.replace(/</g, '%3C');\n      s = s.replace(/>/g, '%3E');\n\n      if (html) {\n        s = '&lt;' + s + '&gt;';\n      } else {\n        s = '<' + s + '>';\n      }\n    } else {\n      s = '\"' + s.replace(/\"/g, '\\\\\"') + '\"';\n    }\n  }\n  return s;\n}\n\n//----------------------------------------------------------------------------------------\n// https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/\nfunction htmlEntities(str) {\n  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');\n}\n\n//----------------------------------------------------------------------------------------\nfunction detect_language(s) {\n  var language = null;\n  var matched = 0;\n  var parts = [];\n\n  var regexp = [];\n\n  // https://gist.github.com/ryanmcgrath/982242\n  regexp['ja'] = /[\\u3000-\\u303F]|[\\u3040-\\u309F]|[\\u30A0-\\u30FF]|[\\uFF00-\\uFFEF]|[\\u4E00-\\u9FAF]|[\\u2605-\\u2606]|[\\u2190-\\u2195]|\\u203B/g;\n  // http://hjzhao.blogspot.co.uk/2015/09/javascript-detect-chinese-character.html\n  regexp['zh'] = /[\\u4E00-\\uFA29]/g;\n  // http://stackoverflow.com/questions/32709687/js-check-if-string-contains-only-cyrillic-symbols-and-spaces\n  regexp['ru'] = /[\\u0400-\\u04FF]/g;\n\n  for (var i in regexp) {\n    parts = s.match(regexp[i]);\n\n    if (parts != null) {\n      if (parts.length > matched) {\n        language = i;\n        matched = parts.length;\n      }\n    }\n  }\n\n  // require a minimum matching\n  if (matched < 2) {\n    language = null;\n  }\n\n  return language;\n\n}\n\n//----------------------------------------------------------------------------------------\nfunction output(doc, triples) {\n  // CouchDB\n  for (var i in triples) {\n    var s = 0;\n    var p = 1;\n    var o = 2;\n\n    var lang = 3;\n\n    var nquads = wrap(triples[i][s], false) +\n      ' ' + wrap(triples[i][p], false) +\n      ' ' + wrap(triples[i][o], false);\n    if (triples[i][lang]) {\n      nquads += '@' + triples[i][lang];\n    }\n\n    nquads += ' .' + \"\\n\";\n\n    // use cluster_id as the key so triples from different versions are linked together\n    emit(doc._id, nquads);\n    //console.log(nquads);\n  }\n}\n\n//----------------------------------------------------------------------------------------\n// START COUCHDB VIEW\nfunction message(doc) {\n if (doc.references) {\n    for (var i in doc.references) {\n       if (doc.references[i].csl) {\n       \n         var identifiers = {};\n         if (doc.references[i].csl.DOI) {\n       \t\tidentifiers['doi'] = doc.references[i].csl.DOI.toLowerCase();\n       \t }\n       \t \n       \t if (doc.references[i].csl.ISSN \n       \t \t&& doc.references[i].csl.volume\n       \t \t&& doc.references[i].csl['page-first']\n       \t \t&& doc.references[i].csl.issued\n       \t \t ) {\n       \t \t \n            var sici = [];\n            sici.push(doc.references[i].csl.ISSN[0]);\n\t\t\tsici.push('(' + doc.references[i].csl.issued['date-parts'][0][0] + ')');\n            sici.push(doc.references[i].csl.volume);\n            sici.push('<' + doc.references[i].csl['page-first'] + '>');\n            \n            identifiers['sici'] = sici.join('');\n       \t }\n         \n         for (var k in identifiers) {\n      \t\n      \t    // eventually handle other kinds of identifiers\n      \t\n      \t\tvar triples = [];\n      \t\t\n      \t\tvar index = parseInt(i) + 1;\n      \t\t\n      \t\tvar subject_id = 'https://species.wikimedia.org/wiki/' + doc._id;\n      \t\t\n      \t\tif (doc.references.length > 1) {      \t\t\n      \t\t subject_id += '#references/' + index;\n      \t\t}\n      \t\t\n      \t\t\n      \t\tvar identifier_id = subject_id + '#' + k;\n      \t\n           if (doc.references[i].csl.author) {\n              for (var j in doc.references[i].csl.author) {\n                if (doc.references[i].csl.author[j].WIKISPECIES) {\n                \n                  // do something here...\n           \n           \t\t // we want simple triples linking name to position in author list\n           \t\t \n           \t\t // identifier\n           \t\t \n\t\t\t\ttriples.push(triple(\n\t\t\t\t  subject_id,\n\t\t\t\t  'http://schema.org/identifier',\n\t\t\t\t  identifier_id));\n\n\t\t\t\ttriples.push(triple(\n\t\t\t\t  identifier_id,\n\t\t\t\t  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',\n\t\t\t\t  'http://schema.org/PropertyValue'));\n\n\t\t\t\ttriples.push(triple(\n\t\t\t\t  identifier_id,\n\t\t\t\t  'http://schema.org/propertyID',\n\t\t\t\t  k));\n\n\t\t\t\ttriples.push(triple(\n\t\t\t\t  identifier_id,\n\t\t\t\t  'http://schema.org/value',\n\t\t\t\t  identifiers[k]\n\t\t\t\t));            \t\t \n\n\t\t\t\tvar author_index = parseInt(j) + 1;\n\t\t\t\tvar role_id    = subject_id + '#role/' + author_index;\n\t\t\t\tvar creator_id = 'https://species.wikimedia.org/wiki/' + doc.references[i].csl.author[j].WIKISPECIES;\n\t\t\t\n\t\t\t\ttriples.push(triple(\n\t\t\t\t\tsubject_id,\n\t\t\t\t\t'http://schema.org/creator',\n\t\t\t\t\trole_id)\n\t\t\t\t\t);\n\n\t\t\t\ttriples.push(triple(\n\t\t\t\t\trole_id,\n\t\t\t\t\t'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',\n\t\t\t\t\t'http://schema.org/Role')\n\t\t\t\t\t);\n\n\t\t\t\ttriples.push(triple(\n\t\t\t\t\trole_id,\n\t\t\t\t\t'http://schema.org/roleName',\n\t\t\t\t\tString(author_index)\n\t\t\t\t\t));\n\n            triples.push(triple(\n            \trole_id,\n                'http://schema.org/creator',\n                creator_id\n                ));\n                                \n\t\t\t  // type, need to handle organisations as authors\n\t\t\t  triples.push(triple(\n\t\t\t  \tcreator_id,\n\t\t\t\t'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',\n\t\t\t\t'http://schema.org/Person'));\n\n\t\t\t  triples.push(triple(\n\t\t\t  \tcreator_id,\n\t\t\t\t'http://schema.org/name',\n\t\t\t\tdoc.references[i].csl.author[j].literal));\n\n                \n\t\t\t\tidentifier_id = creator_id + '#wikispecies';\n\n\t\t\t\ttriples.push(triple(\n\t\t\t\t  creator_id,\n\t\t\t\t  'http://schema.org/identifier',\n\t\t\t\t  identifier_id));\n\n\t\t\t\ttriples.push(triple(\n\t\t\t\t  identifier_id,\n\t\t\t\t  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',\n\t\t\t\t  'http://schema.org/PropertyValue'));\n\n\t\t\t\ttriples.push(triple(\n\t\t\t\t  identifier_id,\n\t\t\t\t  'http://schema.org/propertyID',\n\t\t\t\t  'wikispecies'));\n\n\t\t\t\ttriples.push(triple(\n\t\t\t\t  identifier_id,\n\t\t\t\t  'http://schema.org/value',\n\t\t\t\t  doc.references[i].csl.author[j].WIKISPECIES\n\t\t\t\t)); \n\t\t\t\t\t\n\n\n\t\t\t\toutput(doc, triples);\n                 \n                }\n              }  \n            }\n         }\n       }\n    }\n  }\n}     \n \n \n\n\nfunction (doc) {\n\tmessage(doc);\n}\n// END COUCHDB VIEW\n"},"WIKISPECIES":{"map":"// List WIKISPECIES author ids, \n\nfunction(doc) {\n  if (doc.references) {\n    for (var i in doc.references) {\n       if (doc.references[i].csl) {\n           if (doc.references[i].csl.author) {\n              for (var j in doc.references[i].csl.author) {\n                if (doc.references[i].csl.author[j].WIKISPECIES) {\n                  emit(doc.references[i].csl.author[j].WIKISPECIES, 1);\n                }\n              }\n           \n         }         \n      }\n    }\n  }\n}"}},"language":"javascript"}
