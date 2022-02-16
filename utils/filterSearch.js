const filterSearch = ({ router, page, category, sort, search }) => {
  const path = router.pathname;
  const query = router.query;
  if (category) query.category = category;
  if (page) query.page = page;
  if (search) query.search = search;
  if (sort) query.sort = sort;
  console.log("filterSearch", page);

  router.push({
    pathname: path,
    query: query,
  });
};

export default filterSearch;
