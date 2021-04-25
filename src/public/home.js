"use strict";

const e = React.createElement;

const AppNav = () => (
  <nav class="navbar navbar-dark bg-dark">
    <a class="navbar-brand" href="#">
      Autoscout Reports
    </a>
  </nav>
);

const SellerTypePriceTable = () => {
  const [sellerPrice, setSellerPrice] = React.useState();
  const [isFetching, setIsFetching] = React.useState(false);

  React.useEffect(async () => {
    setIsFetching(true);
    const report = await fetch("/api/report/average_price").then((response) =>
      response.json()
    );
    setSellerPrice(report);
    setIsFetching(false);
  }, []);

  const formatMoney = (value) => {
    return `€ ${Math.round(value).toLocaleString("de")},-`;
  };

  const renderTableRows = () => {
    if (isFetching || !sellerPrice) {
      return;
    }

    return [
      <tr>
        <td>Private</td>
        <td>{formatMoney(sellerPrice.private)}</td>
      </tr>,
      <tr>
        <td>Dealer</td>
        <td>{formatMoney(sellerPrice.dealer)}</td>
      </tr>,
      <tr>
        <td>Other</td>
        <td>{formatMoney(sellerPrice.other)}</td>
      </tr>,
    ];
  };

  return (
    <table className={"table"}>
      <thead>
        <tr>
          <th>Seller Type</th>
          <th>Average In Euro</th>
        </tr>
      </thead>
      <tbody>{renderTableRows()}</tbody>
    </table>
  );
};

const Home = () => {
  React.useEffect(() => {
    console.log("Hello World");
  }, []);

  return (
    <div>
      <AppNav />
      <div className="container">
        <div className="col-sm-6">
          <SellerTypePriceTable />
        </div>
      </div>
    </div>
  );
};

const domContainer = document.querySelector("#root");
ReactDOM.render(e(Home), domContainer);
