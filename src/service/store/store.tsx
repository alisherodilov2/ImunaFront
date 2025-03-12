import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import MenuReducer from '../reducer/MenuReducer'
import ProfileReducer from '../reducer/ProfileReducer'
import OrderReducer from '../reducer/OrderReducer'
import CustomerReducer from '../reducer/CustomerReducer'
import TgGroupReducer from '../reducer/TgGroupReducer'
import MasterReducer from '../reducer/MasterReducer'
import KlinkaReducer from '../reducer/KlinkaReducer'
import DepartmentReducer from '../reducer/DepartmentReducer'
import ServiceTypeReducer from '../reducer/ServiceTypeReducer'
import ServiceReducer from '../reducer/ServiceReducer'
import UserReducer from '../reducer/UserReducer'
import ClientReducer from '../reducer/ClientReducer'
import GraphReducer from '../reducer/GraphReducer'
import TemplateCategoryReducer from '../reducer/TemplateCategoryReducer'
import TemplateReducer from '../reducer/TemplateReducer'
import TreatmentReducer from '../reducer/TreatmentReducer'
import StatisticaReducer from '../reducer/StatisticaReducer'
import ReferringDoctorReducer from '../reducer/ReferringDoctorReducer'
import ExpenseTypeReducer from '../reducer/ExpenseTypeReducer'
import ExpenseReducer from '../reducer/ExpenseReducer'
import ProductCategoryReducer from '../reducer/ProductCategoryReducer'
import ProductReducer from '../reducer/ProductReducer'
import ProductReceptionReducer from '../reducer/ProductReceptionReducer'
import MaterialExpenseReducer from '../reducer/MaterialExpenseReducer'
import AdvertisementsReducer from '../reducer/AdvertisementsReducer'
import DoctorTemplateReducer from '../reducer/DoctorTemplateReducer'
import PharmacyProductReducer from '../reducer/PharmacyProductReducer'
import RoomReducer from '../reducer/RoomReducer'
import BranchReducer from '../reducer/BranchReducer'
import ProductOrderReducer from '../reducer/ProductOrderReducer'
import PatientComplaintReducer from '../reducer/PatientComplaintReducer'
import PatientDiagnosisReducer from '../reducer/PatientDiagnosisReducer'
import MedicineTypeReducer from '../reducer/MedicineTypeReducer'
import CrudClass from '../reducer/CrudClass'
const store = configureStore({
    reducer: {
        MenuReducer,
        MedicineTypeReducer,
        PatientDiagnosisReducer,
        KlinkaReducer,
        ProfileReducer,
        PatientComplaintReducer,
        DepartmentReducer,
        ServiceTypeReducer,
        ServiceReducer,
        UserReducer,
        ClientReducer,
        GraphReducer,
        TemplateCategoryReducer,
        TemplateReducer,
        TreatmentReducer,
        StatisticaReducer,
        ReferringDoctorReducer,
        ExpenseTypeReducer,
        ExpenseReducer,
        ProductCategoryReducer,
        ProductReducer,
        ProductReceptionReducer,
        MaterialExpenseReducer,
        AdvertisementsReducer,
        DoctorTemplateReducer,
        RoomReducer,
        PharmacyProductReducer,
        BranchReducer,
        ProductOrderReducer,
        // MasterReducer,
        // TgGroupReducer,
        // OrderReducer,
        // CustomerReducer,

    },
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch()
export default store