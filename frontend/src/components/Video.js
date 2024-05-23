const Video = ({videoSrc}) => {
  return (
    <video controls className="w-full" key={videoSrc}>
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;