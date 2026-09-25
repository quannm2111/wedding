import "./loading.scss";

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <img width={88} height={88} src="./DH.jpg" alt="Quân và Hường" />
        <p className="loading-names">Quân & Hường</p>
        <div className="loading-bar" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
