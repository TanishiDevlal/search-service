import express from 'express';
import FleetController from '../controllers/fleet.controller.js';

const router = express.Router();
const fleetController = new FleetController();

router.get('/ping', (req, res) => res.json({ message: 'search-service fleet route active' }));

// router.get('/allFleets', fleetController.getFleets.bind(fleetController));
// router.get('/dimensions', fleetController.getDimensions.bind(fleetController));
// router.get('/machine/:id', fleetController.getMachineDetail.bind(fleetController));
// router.get('/category/:machineType', fleetController.getCategoryDetail.bind(fleetController));
// router.get('/searchMachines', fleetController.searchMachines.bind(fleetController));

router.get('/suggested-machines', fleetController.getSuggestedMachines.bind(fleetController));
router.get('/all-machine-variants', fleetController.getAllMachineVariants.bind(fleetController));
router.get('/userSearch', fleetController.searchMachines.bind(fleetController));
router.post('/machine-variant/v1', fleetController.getMachineVariant.bind(fleetController));

export default router;