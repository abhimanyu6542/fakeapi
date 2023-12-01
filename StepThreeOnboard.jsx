import React, { useEffect, useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import stepperContextOnboard from '../context/Context';
import { BsFillArrowRightSquareFill, BsFillArrowLeftSquareFill } from 'react-icons/bs';

const operatorSchema = {
  operatorName: yup.string().required('Operator name is required'),
  operatorEmail: yup.string().email('Invalid email').required('Operator email is required'),
  operatorPhone: yup
    .number()
    .max(9999999999)
    .typeError('Operator phone must be a number')
    .required('Operator phone is required'),
};

const registerSchema = {
  registerName: yup.string().required('Register name is required'),
  receiptNumberPrefix: yup.string().required('Receipt number prefix is required'),
  billHeader: yup.string().required('Bill header is required'),
  billFooter: yup.string().required('Bill footer is required'),
  printReceiptsAndOrderTickets: yup
    .boolean()
    .required('Please specify if you want to print receipts and order tickets'),
  includeShopLogoInReceipts: yup
    .boolean()
    .required('Please specify if you want to include the shop logo in printed receipts'),
};

const schema = yup.object({
  operator: yup.object().shape(operatorSchema),
  register: yup.object().shape(registerSchema),
});

const StepThreeOnboard = () => {
  const {
    register_details,
    setRegister_details,
    operator_details,
    setOperator_details,
    setNextStep,
    setBspinner,
    showRegister,
    setShowRegister,
  } = useContext(stepperContextOnboard);
  const [operatorData, setOperatotData] = useState({});

  useEffect(() => {
    setBspinner(false);
  }, []);

  useEffect(() => {
    setShowRegister(false);
  }, []);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
    trigger,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      operator: {
        operatorName: '',
        operatorEmail: '',
        operatorPhone: '',
      },
      register: {
        registerName: '',
        receiptNumberPrefix: '',
        billHeader: '',
        billFooter: '',
        printReceiptsAndOrderTickets: false,
        includeShopLogoInReceipts: false,
      },
    },
  });

  const handleSet = (data) => {
    const operatorModifiedData = {
      full_name: data.operator?.operatorName,
      email: data.operator?.operatorEmail,
      phone: data.operator?.operatorPhone,
    };
    setOperatotData(operatorModifiedData);
    const registerModifiedData = {
      name: data.register?.registerName,
      prefix: data.register?.receiptNumberPrefix,
      bill_header: data.register?.billHeader,
      bill_footer: data.register?.billFooter,
      print_receipts: data.register?.printReceiptsAndOrderTickets,
      include_logo_in_bill: data.register?.includeShopLogoInReceipts,
    };

    console.log('operator data', operatorModifiedData);
    console.log('register data', registerModifiedData);

    setOperator_details((prevState) => ({
      ...prevState,
      ...operatorModifiedData,
    }));

    setRegister_details((prevState) => ({
      ...prevState,
      ...registerModifiedData,
    }));

    if (
      data.operator.operatorName &&
      data.operator.operatorEmail &&
      data.operator.operatorPhone &&
      data.register.registerName &&
      data.register.receiptNumberPrefix &&
      data.register.billHeader &&
      data.register.billFooter
    ) {
      setNextStep(true);
    } else {
      setNextStep(false);
    }
  };

  const [validFullName, setValidFullName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPhone, setValidPhone] = useState(true);

  const handleNextButton = () => {
    console.log(operatorData);
    if (!operatorData.full_name) {
      setValidFullName(false);
    }
    if (!operatorData.email) {
      setValidEmail(false);
    }
    if (!operatorData.phone) {
      setValidPhone(false);
    }
    if (operatorData.full_name && operatorData.email && operatorData.phone) {
      setShowRegister(true);
    } else {
      setShowRegister(false);
    }
  };

  useEffect(() => {
    const subscription = watch((value) => {
      handleSet(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <div className="mb-8 flex w-full flex-col items-center justify-center">
      <h1 className="mb-2 text-2xl font-bold text-black">
        Let’s understand what is this step all about?
      </h1>
      <p className="mb-6 w-9/12 text-center text-xs text-gray-500">
        Lorem ipsum dolor sit amet consectetur. Id quam vitae adipiscing ultrices egestas. Ac vitae
        pellentesque ultricies convallis blandit viverra urna aliquet. Tincidunt congue enim
        pellentesque eget eu tristique in. Cursus tincidunt elementum{' '}
      </p>
      <form className="w-8/12 space-y-6">
        <div className="space-y-4 p-4">
          <div className={`space-y-4` + (showRegister ? ' hidden' : ' visible')}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Operator Details</h2>
              <h1 className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-gray-400">
                1/2
              </h1>
            </div>
            <div className="flex flex-col space-y-2">
              <Controller
                name="operator.operatorName"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="mb-2 block text-xs">Operator Name</label>
                    <input {...field} type="text" className="h-10 w-full rounded-sm border p-1" />
                    {!validFullName && (
                      <div className="text-xs text-red-500">
                        {errors?.operator?.operatorName?.message}
                      </div>
                    )}
                  </div>
                )}
              />
              <Controller
                name="operator.operatorEmail"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="mb-2 block text-xs">Operator Email</label>
                    <input {...field} type="email" className="h-10 w-full rounded-sm border p-1" />
                    {!validEmail && (
                      <div className="text-xs text-red-500">
                        {errors?.operator?.operatorEmail?.message}
                      </div>
                    )}
                  </div>
                )}
              />
              <Controller
                name="operator.operatorPhone"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="mb-2 block text-xs">Operator Phone</label>
                    <input {...field} type="number" className="h-10 w-full rounded-sm border p-1" />
                    {!validPhone && (
                      <div className="text-xs text-red-500">
                        {errors?.operator?.operatorPhone?.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
            {/* <button type='button' onClick={()=>setShowRegister(true)} className='w-full flex justify-end'><BsFillArrowRightSquareFill className='text-lg font-medium'/></button> */}
            <div className="flex w-full items-center justify-center pt-16">
              <div
                onClick={handleNextButton}
                className={
                  operatorData.full_name && operatorData.email && operatorData.phone
                    ? 'flex h-10 w-64 cursor-pointer items-center justify-center rounded-md bg-black text-white hover:bg-gray-800'
                    : 'flex h-10 w-64 items-center justify-center rounded-md bg-black text-white hover:bg-gray-800'
                }
              >
                Next
              </div>
            </div>
          </div>
          <div className={`space-y-4` + (showRegister ? ' visible' : ' hidden')}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Register Details</h2>
              <h1 className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-gray-400">
                2/2
              </h1>
            </div>
            <div className="text-xs text-red-500">All Fields are Required</div>
            <div className="flex flex-col space-y-2">
              <Controller
                name="register.registerName"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="mb-2 block text-xs">Register Name</label>
                    <input {...field} type="text" className="h-10 w-full rounded-sm border p-1" />
                  </div>
                )}
              />
              <Controller
                name="register.receiptNumberPrefix"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="mb-2 block text-xs">Receipt Number Prefix</label>
                    <input {...field} type="text" className="h-10 w-full rounded-sm border p-1" />
                  </div>
                )}
              />
              <Controller
                name="register.billHeader"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="mb-2 block text-xs">Bill Header</label>
                    <input {...field} type="text" className="h-10 w-full rounded-sm border p-1" />
                  </div>
                )}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Controller
                name="register.billFooter"
                control={control}
                render={({ field }) => (
                  <div className="mb-3">
                    <label className="mb-2 block text-xs">Bill Footer</label>
                    <input {...field} type="text" className="h-10 w-full rounded-sm border p-1" />
                  </div>
                )}
              />
              <Controller
                name="register.printReceiptsAndOrderTickets"
                control={control}
                render={({ field }) => (
                  <div className="mb-2">
                    <div className="flex w-full items-center justify-start">
                      <label className="mr-5 block text-xs text-gray-500">
                        Print Receipts and Order Tickets
                      </label>
                      <input {...field} type="checkbox" className="border p-1" />
                    </div>
                  </div>
                )}
              />
              <Controller
                name="register.includeShopLogoInReceipts"
                control={control}
                render={({ field }) => (
                  <div>
                    <div className="flex w-full items-center justify-start">
                      <label className="mr-5 block text-xs text-gray-500">
                        Include Shop Logo in Printed Receipts
                      </label>
                      <input {...field} type="checkbox" className="border p-1" />
                    </div>
                  </div>
                )}
              />
            </div>
            {/* <button type='button'onClick={()=>setShowRegister(false)} className='w-full flex justify-end'><BsFillArrowLeftSquareFill className='text-lg font-medium'/></button> */}
            <div className="flex w-full items-center justify-center pt-16">
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="-mb-10 flex h-10 w-64 items-center justify-center rounded-md bg-gray-100 text-gray-400 hover:bg-gray-50"
              >
                Previous
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StepThreeOnboard;
