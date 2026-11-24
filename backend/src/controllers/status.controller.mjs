export const getStatus = (req, res) => {
  res.json({
    status: "success",
    message: "Backend ServisHub aktif",
  });
};