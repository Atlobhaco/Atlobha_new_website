// components/ProductCardSkeleton.js
import React from "react";
import ContentLoader from "react-content-loader";

const ProductCardSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={300}
    height={400}
    viewBox="0 0 300 400"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect
      x="0"
      y="0"
      rx="10"
      ry="10"
      width="95%"
      height={props?.height || 200}
    />{" "}
    {/* Image */}
    {/* <rect x="0" y="220" rx="5" ry="5" width="300" height="20" /> 
    <rect x="0" y="250" rx="5" ry="5" width="200" height="15" />
    <rect x="0" y="280" rx="5" ry="5" width="100" height="20" />  */}
  </ContentLoader>
);

export default ProductCardSkeleton;
