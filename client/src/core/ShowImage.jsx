import React from "react";
import { API } from "../config";

const ShowImage = ({ item, url }) => (
  <div className="">
    <img
      src={`${API}/${url}/photo/${item._id}`}
      alt={item.name}
      className="mb-3 product-img"
      // style={{ height: "16rem", width: "16rem" }}
    />
  </div>
);

export default ShowImage;