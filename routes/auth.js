const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "please provide a password greater than 5 char").isLength(
      { min: 6 }
    ),
  ],
  async (req, res) => {
    const { password, email } = req.body;

    //Validated The Input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    console.log(password, email);
    // if (password.length < 6) res.send("auth route working");
    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: "This user is already exit",
          },
        ],
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    //Validate if user doesn't already exist
    users.push({
      email,
      password: hashPassword,
    });

    const token = await JWT.sign(
      {
        email,
      },
      "57ed87efte8esvsd9s9sadfvs9ad",
      {
        expiresIn: 3600000,
      }
    );
    res.json({
      token,
    });
    console.log(hashPassword);
    res.send("Validation passed");
  }
);

router.post("/login", async (req, res) => {
  const { password, email } = req.body;
  let user = users.find((user) => {
    return user.email === email;
  });

  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    });
  }

  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    });
  }

  const token = await JWT.sign(
    {
      email,
    },
    "57ed87efte8esvsd9s9sadfvs9ad",
    {
      expiresIn: 3600000,
    }
  );
  res.json({
    token,
  });
});
router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;
