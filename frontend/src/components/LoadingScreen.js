import splash from '../assets/splash.png';

const LoadingScreen = () => {
  return (
    <div className="loading-body">
      <div className="main-content">
        <img src={splash} />
      </div>
    </div>
  )
}

export default LoadingScreen