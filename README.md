# wikispecies-crowdsource
Wikispecies as a crowdsourced bibliographic database


## Bulk upload

```
curl http://127.0.0.1:5984/wikispecies-crowdsource/_design/export/_list/jsonl/elastic > elastic.jsonl
``` 

## Clustering in search

Clustering search results by cluster_id to group together multiple copies of the same reference. By default aggregations return only 10 results, so if we return more than 10 results we may have cluster_ids in the hits that aren’t in the eggs. Make sure the value for "size" for the cluster agg is the same as the number of search results requested.

## Link testing

```
curl http://127.0.0.1:5984/oz-wikispecies/_design/link/_list/key/pdf > pdfs.txt
```

Test each link to get HTTP code.

## Authors

List all authors with WIKISPECIES page (could use to map to Wikidata items)

## Examples

### A new genus of Australian clavicorn Coleoptera, probably of a new family
A new genus of Australian clavicorn Coleoptera, probably of a new family
Published in Proceedings of the Linnean Society of New South Wales, in 1965, in volume 89, pages 241-245
https://species.wikimedia.org/wiki/Cavognathidae#01


A new genus of Australian clavicorn Coleoptera, probably of a new family
Published in Proceedings of the Linnean Society of New South Wales, in 1965, in volume 89, pages 241-245
https://species.wikimedia.org/wiki/Taphropiestes#21

### A revision of Australian Thrasorinae (Hymenoptera: Figitidae) with a description of a new genus and six new species

A revision of Australian Thrasorinae (Hymenoptera: Figitidae) with a description of a new genus and six new species
Published in Australian journal of entomology, in 2008, in volume 47, issue 3, pages 203-212
A revision of Australian Thrasorinae (Hymenoptera: Figitidae) with a description of a new genus and six
new species Australian journal of entomology Buffington, M.L. 2008 47 3 203-212 10.1111/j.1440-6055.2008.00647
https://species.wikimedia.org/wiki/Cicatrix_schauffi#1
DOI:10.1111/j.1440-6055.2008.00647.x

A revision of Australian Thrasorinae (Hymenoptera: Figitidae) with a description of a new genus and six new species
Published in Australian journal of entomology, in 2008, in volume 47, issue 3, pages 203-212
A revision of Australian Thrasorinae (Hymenoptera: Figitidae) with a description of a new genus and six
new species Australian journal of entomology Buffington, M.L. 2008 47 3 203-212 10.1111/j.1440-6055.2008.00647
https://species.wikimedia.org/wiki/Thrasorinae#1
DOI:10.1111/j.1440-6055.2008.00647.x

A revision of Australian Thrasorinae (Hymenoptera: Figitidae) with a description of a new genus and six new species
Published in Australian journal of entomology, in 2008, in volume 47, issue 3, pages 203-212
A revision of Australian Thrasorinae (Hymenoptera: Figitidae) with a description of a new genus and six
new species Australian journal of entomology Buffington, M.L. 2008 47 3 203-212 10.1111/j.1440-6055.2008.00647
https://species.wikimedia.org/wiki/Thrasorus#1
DOI:10.1111/j.1440-6055.2008.00647.x

A revision of Australian Thrasorinae (Hymenoptera: Figitidae) with a description of a new genus and six new species
Published in Australian journal of entomology, in 2008, in volume 47, issue 3, pages 203-212
A revision of Australian Thrasorinae (Hymenoptera: Figitidae) with a description of a new genus and six
new species Australian journal of entomology Buffington, M.L. 2008 47 3 203-212 10.1111/j.1440-6055.2008.00647
https://species.wikimedia.org/wiki/Mikeius#1
DOI:10.1111/j.1440-6055.2008.00647.x

### Massive duplication

11 copies at least 

Revision of the rove beetle genus Antimerus (Coleoptera, Staphylinidae, Staphylininae), a puzzling endemic Australian lineage of the tribe Staphylinini


#### Too many copies

Hash [1871, 43, 111] has 550 records, which means pairwise clustering will fail epically - need to think how to handle these cases…


## Heroku notes

```
composer require php:^5.6
echo "vendor/" > .gitignore
heroku create --stack heroku-16 wikispecies-crowdsource
```

Need stack ```heroku-16``` to have PHP 5.6.
