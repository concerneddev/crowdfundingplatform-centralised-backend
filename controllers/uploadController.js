export const uploadController = async (req, res) => {
    try {
        console.log("req.file: ", req.file);
        return res.status(201).send({
            reqFile: req.file
          });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
}