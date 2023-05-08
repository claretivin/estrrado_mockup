import React, { useEffect, useState } from "react";
import { Table, Checkbox } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

const { Column, HeaderCell, Cell } = Table;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

export default function Dashboard() {
  const [data, setdata] = useState();
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [open, setOpen] = React.useState(false);

  const fetchdata = async () => {
    try {
      await fetch("/data.json")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          //   console.log(data);
          setdata(data);
        });
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  let checked = false;
  let indeterminate = false;
  if (checkedKeys?.length === data?.length) {
    checked = true;
  } else if (checkedKeys?.length === 0) {
    checked = false;
  } else if (checkedKeys?.length > 0 && checkedKeys?.length < data?.length) {
    indeterminate = true;
  }

  const handleCheckAll = (value, checked) => {
    const keys = checked ? data.map((item) => item) : [];
    setCheckedKeys(keys);
  };
  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkedKeys, value]
      : checkedKeys.filter((item) => item !== value);
    setCheckedKeys(keys);
  };

  return (
    <>
      <div className="container">
        <Table
          height={400}
          data={data != null ? data : []}
          rowHeight={70}
          headerHeight={50}
          wordWrap="break-word"
          loading={data != null ? false : true}
        >
          <Column width={50} align="center">
            <HeaderCell style={{ padding: 0 }}>
              <div style={{ lineHeight: "40px" }}>
                <Checkbox
                  inline
                  checked={checked}
                  indeterminate={indeterminate}
                  onChange={handleCheckAll}
                />
              </div>
            </HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <>
                    <Checkbox
                      value={rowData}
                      inline
                      onChange={handleCheck}
                      checked={checkedKeys.some((item) => item === rowData)}
                    />
                  </>
                );
              }}
            </Cell>
          </Column>
          <Column minWidth={250} flexGrow={1}>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column minWidth={250} flexGrow={1}>
            <HeaderCell>Title</HeaderCell>
            <Cell dataKey="title" />
          </Column>
          <Column minWidth={250} flexGrow={1}>
            <HeaderCell>Category</HeaderCell>
            <Cell dataKey="category" />
          </Column>
          <Column minWidth={250} flexGrow={1}>
            <HeaderCell>Price</HeaderCell>
            <Cell dataKey="price" />
          </Column>
        </Table>
        <Button
          style={{
            marginTop: "20px",
          }}
          variant="contained"
          disableElevation
          onClick={() => {
            console.log(checkedKeys);
            setOpen(true);
          }}
        >
          Add To Cart
        </Button>
      </div>

      {/*Cart Modal*/}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Grid container spacing={2}>
              <Grid xs={9}>
                {" "}
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Shopping Cart
                </Typography>
              </Grid>
              <Grid xs={3}>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Price
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            {checkedKeys.map((e, i) => {
              return (
                <>
                  <Grid container spacing={2}>
                    <Grid xs={2}>
                      <img
                        style={{
                          width: "75px",
                          height: "75px",
                        }}
                        src={e.image}
                        srcSet={""}
                        loading="lazy"
                      />
                    </Grid>
                    <Grid xs={7}>
                      <Typography variant="body1" gutterBottom>
                        {e.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                      >
                        In Stock
                      </Typography>
                    </Grid>
                    <Grid xs={3}>
                      <Typography variant="body1" gutterBottom>
                        {e.price}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                </>
              );
            })}
            <Grid container spacing={2}>
              <Grid xs={7}></Grid>
              <Grid xs={5}>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Subtotal:{" "}
                  {checkedKeys.reduce((e, i) => {
                    return e + i.price;
                  }, 0)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
