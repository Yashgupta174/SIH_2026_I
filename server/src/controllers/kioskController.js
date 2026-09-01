const Kiosk = require('../models/Kiosk');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllKiosks = catchAsync(async (req, res, next) => {
  const kiosks = await Kiosk.find().sort({ kioskCode: 1 });
  res.status(200).json({
    status: 'success',
    count: kiosks.length,
    kiosks,
  });
});

exports.kioskHeartbeat = catchAsync(async (req, res, next) => {
  const { kioskCode, peripherals, status } = req.body;

  let kiosk = await Kiosk.findOne({ kioskCode });
  if (!kiosk) {
    kiosk = await Kiosk.create({
      kioskCode: kioskCode || `KIOSK-${Math.floor(100 + Math.random() * 900)}`,
      locationName: 'OPD Main Counter',
      status: status || 'ONLINE',
      peripherals: peripherals || {},
    });
  } else {
    kiosk.lastHeartbeat = new Date();
    if (status) kiosk.status = status;
    if (peripherals) kiosk.peripherals = { ...kiosk.peripherals, ...peripherals };
    await kiosk.save();
  }

  res.status(200).json({
    status: 'success',
    message: 'Kiosk heartbeat received.',
    kiosk,
  });
});
