export default function Error({ statusCode }) {
  return (
    <div>
      {statusCode
        ? `An error ${statusCode} occurred on the server`
        : "An error occurred on the client"}
    </div>
  );
}
Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
