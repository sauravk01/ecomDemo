import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import filterSearch from "../utils/filterSearch";

const Filter = ({ handleKeyPress, search, setSearch, handleSearch }) => {
  const router = useRouter();
  // const [tags,setTags]=useState([])
  useEffect(() => {
    filterSearch({ router, search: search.toLowerCase() });
  }, [search]);
  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        list="title_product"
        value={search.toLowerCase()}
        onChange={(e) => setSearch(e.target.value)}
        // onKeyPress={handleKeyPress}
      />
      <button type="submit">search</button>
    </form>
  );
};

export default Filter;
