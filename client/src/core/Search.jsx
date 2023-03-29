import React, { useState, useEffect } from "react";
import { getCategories } from "./apiProducts";

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    searched: false,
  });

  const { categories } = data;

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };
  useEffect(() => {
    loadCategories();
  }, []);

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <div className="input-group-text ">
        <div className="input-group ">
          <div className="input-group-prepend text-center">
            <select className="btn mr-2" onChange={handleChange("category")}>
              <option value="All"> Pick Category</option>
              {categories.map((c, i) => (
                <option key={i} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
       
      </div>

      <span className="input-group mb-3 mt-1">
        <input
          type="search"
          className="form-control"
          onChange={handleChange("search")}
          placeholder="Search"
          aria-label="Search"
          aria-describedby="button-addon2"
        />
        <div className="input-group-append">
          <button
            className="btn btn-danger "
         
           
          >
            Search
          </button>
        </div>
      </span>
    </form>
  );
    
    
    const handleChange = name => event => {
      
    };
    

    const searchSubmit = e => {
        e.preventDefault();
        
  };

  return (
    <div className="row">
          <div className="container mb-3">{searchForm()}
          </div>
    </div>
  );
};

export default Search;
