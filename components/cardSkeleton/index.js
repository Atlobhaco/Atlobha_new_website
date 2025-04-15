import React from "react";
import ContentLoader from "react-content-loader";

const ProductCardSkeleton = ({ height }) => (
  <ContentLoader
    speed={2}
    width="100%" // Full width
    height={height || 400}
    viewBox="0 0 100% 400"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{ width: "100%", marginBottom: "10px" }} // Ensure the style also enforces full width
  >
    <rect x="0" y="0" rx="10" ry="10" width="100%" height={height || 200} />
  </ContentLoader>
);

export default ProductCardSkeleton;
