"use strict";

const e = React.createElement;

const AppNav = () => (
  <nav className="navbar navbar-dark bg-dark">
    <a className="navbar-brand" href="#">
      Autoscout24 Reports
    </a>
  </nav>
);

const formatPercentage = (value) => {
  return `${Math.round(value * 100)} %`;
};

const formatMoney = (value) => {
  return `€ ${Math.round(value).toLocaleString("de")},-`;
};

const formatMileage = (value) => {
  return `${Math.round(value).toLocaleString("de")} KM`;
};

const SellerTypePriceTable = () => {
  const [sellerPrice, setSellerPrice] = React.useState();
  const [isFetching, setIsFetching] = React.useState(false);

  React.useEffect(async () => {
    setIsFetching(true);
    const report = await fetch("/api/reports/average_price").then((response) =>
      response.json()
    );
    setSellerPrice(report);
    setIsFetching(false);
  }, []);

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
      </tr>
    ];
  };

  return (
    <div>
      <h4>Average Listing Selling Price per Seller Type</h4>
      <table className={"table"}>
        <thead>
        <tr>
          <th>Seller Type</th>
          <th>Average In Euro</th>
        </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </div>
  );
};

const DistributionTable = () => {
  const [distribution, setDistribution] = React.useState();
  const [isFetching, setIsFetching] = React.useState(false);

  React.useEffect(async () => {
    setIsFetching(true);
    const report = await fetch("/api/reports/distribution").then((response) =>
      response.json()
    );
    setDistribution(report);
    setIsFetching(false);
  }, []);

  const renderTableRows = () => {
    if (isFetching || !distribution) {
      return;
    }

    return distribution.map(({ make, percentage }) => {
      return (
        <tr>
          <td>{make}</td>
          <td>{formatPercentage(percentage)}</td>
        </tr>
      );
    });
  };

  return (
    <div>
      <h4>Percentual distribution of available cars by make</h4>
      <table className={"table"}>
        <thead>
        <tr>
          <th>Make</th>
          <th>Distribution</th>
        </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </div>
  );
};

const AveragePrice = () => {
  const [topPercentile, setTopPercentile] = React.useState();

  React.useEffect(async () => {
    const report = await fetch("/api/reports/top_percentile").then((response) =>
      response.json()
    );
    setTopPercentile(report.average);
  }, []);

  return (
    <div>
      <h4>Avg Price of the top 30 listings</h4>
      <table className={"table"}>
        <thead>
        <tr>
          <th>AveragePrice</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{topPercentile && formatMoney(topPercentile)}</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

const TopFiveListingsPerMonth = () => {
  const [listingsPerMonth, setListingsPerMonth] = React.useState({});

  React.useEffect(async () => {
    const report = await fetch(
      "/api/reports/listings_per_month"
    ).then((response) => response.json());
    setListingsPerMonth(report);
  }, []);

  return (
    <div>
      <h4>Top Listings per Month</h4>
      {Object.keys(listingsPerMonth).map((key) => {
        return (
          <div className="row">
            <span>
              <strong>{key}</strong>
            </span>
            <table className={"table"}>
              <thead>
              <tr>
                <th>Ranking</th>
                <th>Listing id</th>
                <th>Make</th>
                <th>Selling Price</th>
                <th>Mileage</th>
                <th>Total Amount of contacts</th>
              </tr>
              </thead>
              <tbody>
              {listingsPerMonth[key].map((listing, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{listing.listingId}</td>
                    <td>{listing.make}</td>
                    <td>{formatMoney(listing.price)}</td>
                    <td>{formatMileage(listing.mileage)}</td>
                    <td>{listing.contactsPerListing}</td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

const Home = () => {
  const [contactsFile, setContactsFile] = React.useState();
  const [listingsFile, setListingsFile] = React.useState();
  const [showAlert, setShowAlert] = React.useState({ variant: "success", text: "", visible: false });
  const onFileUpload = (event, type) => {
    if (type === "contacts") {
      setContactsFile(event.target.files[0]);
    } else if (type === "listings") {
      setListingsFile(event.target.files[0]);
    }
  };

  const upload = (type) => {
    const form = new FormData();

    if (type === "contacts") {
      form.append("csv", contactsFile);
    } else if (type === "listings") {
      form.append("csv", listingsFile);
    }

    fetch(`/api/${type}`, {
      method: "POST",
      body: form
    }).then(res => {
      if (res.status === 409 || res.status === 400) {
        setShowAlert({
          variant: "danger",
          text: `Uploaded  ${type}  CSV is invalid. Please check again`,
          visible: true
        });
      } else {
        setShowAlert({
          variant: "success",
          text: `successfully uploaded ${type}`,
          visible: true
        });
      }
    })
    .catch((err) => {
      setShowAlert({
        variant: "danger",
        text: err,
        visible: true
      });
    });
  };

  return (
    <div>
      <AppNav />
      {showAlert.visible &&
      <div className={`alert alert-${showAlert.variant}`} role="alert">
        {showAlert.text}
      </div>}
      <div className="container">
        <div className="row mb-3">
          <div className="col-sm-6">
            <div className="row">
              <h4>Update Contacts</h4>
            </div>
            <div className="row">
              <input type="file"
                     name="file"
                     onChange={(event) => onFileUpload(event, "contacts")} />
              <button type="button"
                      className="btn btn-success pull-right"
                      onClick={() => upload("contacts")}>
                Upload
              </button>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="row">
              <h4>Update Listings</h4>
            </div>
            <div className="row">
              <input type="file"
                     name="file"
                     onChange={(event) => onFileUpload(event, "listings")} />
              <button type="button"
                      className="btn btn-success pull-right"
                      onClick={() => upload("listings")}>
                Upload
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="row">
              <AveragePrice />
            </div>
            <div className="row">
              <SellerTypePriceTable />
            </div>
          </div>

          <div className="col-sm-6">
            <DistributionTable />
          </div>

          <div className="col-sm-12">
            <TopFiveListingsPerMonth />
          </div>
        </div>
      </div>
    </div>
  );
};

const domContainer = document.querySelector("#root");
ReactDOM.render(e(Home), domContainer);
