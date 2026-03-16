import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DashboardLayout } from '../../components/layout';
import { Button, Input, Select, Textarea, Card } from '../../components/ui';
import { WORK_MODES, POPULAR_TAGS } from '../../constants';

const step1Schema = z.object({
    company: z.string().min(2, 'Company name required'),
    jobTitle: z.string().min(5, 'Job title is too short'),
    jobUrl: z.string().url('Must be a valid URL'),
    department: z.string().min(2, 'Department required'),
    location: z.string().min(2, 'Location required'),
    workMode: z.enum(['remote', 'hybrid', 'onsite'], { required_error: 'Work mode required' })
});

const step2Schema = z.object({
    description: z.string().min(50, 'Provide a meaningful description (>50 chars)'),
    requirements: z.array(z.object({ value: z.string().min(5) })).min(1, 'Add at least one requirement'),
    tags: z.string() // we will parse this into array in submit logic mapping csv strings natively securely
});

const step3Schema = z.object({
    slotsTotal: z.coerce.number().min(1, 'Must offer at least 1 slot').max(50, 'Maximum 50 slots allowed')
});

export const CreateListingPage = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    // Multi-step form setup natively
    const { register, handleSubmit, trigger, control, watch, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            company: '', jobTitle: '', jobUrl: '', department: '', location: '', workMode: 'remote',
            description: '', requirements: [{ value: '' }], tags: '',
            slotsTotal: 1
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "requirements" });
    const formValues = watch();

    const handleNext = async () => {
        let isValid = false;
        if (step === 1) isValid = await trigger(['company', 'jobTitle', 'jobUrl', 'department', 'location', 'workMode']);
        if (step === 2) isValid = await trigger(['description', 'requirements', 'tags']);
        if (step === 3) isValid = await trigger(['slotsTotal']);

        if (isValid) {
            setStep(s => Math.min(s + 1, 4));
            window.scrollTo(0, 0);
        }
    };

    const onSubmit = async (data) => {
        try {
            const { createListing } = await import('../../api/listing.api.js');
            const finalData = {
                ...data,
                slotsAvailable: Number(data.slotsTotal),
                slotsTotal: Number(data.slotsTotal),
                requirements: data.requirements.map(r => r.value).filter(Boolean),
                tags: data.tags.split(',').map(t => t.trim()).filter(Boolean)
            };
            const res = await createListing(finalData);
            // res = { success, statusCode, message, data: { listing } }
            const listingId = res?.data?.listing?._id || res?.data?._id;
            toast.success('Listing published successfully!');
            navigate(listingId ? `/listings/${listingId}` : '/dashboard/referrer');
        } catch (err) {
            const msg = err?.response?.data?.message || 'Failed to publish listing';
            toast.error(msg);
            console.error('Create listing failed:', err?.response?.data || err);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto py-8 lg:py-12">
                <div className="mb-10">
                    <Link to="/dashboard/listings" className="text-sm font-medium text-gray-500 hover:text-black mb-6 inline-flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to listings
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Create New Referral Listing</h1>
                    <p className="text-sm text-gray-500">Provide details about the open position at your company to attract the right talent.</p>
                </div>

                {/* Progress Tracker explicitly completely parsing native borders matching steps dynamically */}
                <div className="mb-10 flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10 -translate-y-1/2" />
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex flex-col items-center gap-2 bg-gray-50 px-2 relative z-10 w-24 text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${step > s ? 'bg-black border-black text-white' :
                                step === s ? 'bg-white border-black text-black' : 'bg-gray-100 border-gray-200 text-gray-400'
                                }`}>
                                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                            </div>
                            <span className={`text-xs font-semibold uppercase tracking-wide ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                                {s === 1 ? 'Job' : s === 2 ? 'Details' : s === 3 ? 'Availability' : 'Review'}
                            </span>
                        </div>
                    ))}
                </div>

                <Card padding="lg" className="shadow-lg border-gray-200">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* STEP 1 */}
                        <div className={step === 1 ? 'block' : 'hidden'}>
                            <h2 className="text-xl font-bold text-black border-b border-gray-100 pb-4 mb-6">Basic Job Information</h2>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label="Company Name" placeholder="e.g. Google" error={errors.company?.message} {...register('company')} />
                                    <Input label="Job Title" placeholder="Senior Frontend Engineer" error={errors.jobTitle?.message} {...register('jobTitle')} />
                                </div>
                                <Input label="Original Job Posting URL" placeholder="https://careers.google.com/..." error={errors.jobUrl?.message} {...register('jobUrl')} />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <Input label="Department" placeholder="e.g. Core Search" error={errors.department?.message} {...register('department')} />
                                    <Input label="Location" placeholder="Mountain View, CA" error={errors.location?.message} {...register('location')} />
                                    <Select
                                        label="Work Mode"
                                        options={WORK_MODES.map(m => ({ label: m.charAt(0).toUpperCase() + m.slice(1), value: m }))}
                                        error={errors.workMode?.message}
                                        {...register('workMode')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* STEP 2 */}
                        <div className={step === 2 ? 'block' : 'hidden'}>
                            <h2 className="text-xl font-bold text-black border-b border-gray-100 pb-4 mb-6">Role Details & Requirements</h2>
                            <div className="space-y-6">
                                <Textarea
                                    label="Job Description"
                                    placeholder="Describe the team, the role, and what the candidate will be doing..."
                                    rows={6}
                                    error={errors.description?.message}
                                    {...register('description')}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Key Requirements</label>
                                    <div className="space-y-3 mb-3">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2 items-start">
                                                <div className="flex-1">
                                                    <Input
                                                        placeholder="e.g. 3+ years experience in React"
                                                        {...register(`requirements.${index}.value`)}
                                                        error={errors.requirements?.[index]?.value?.message}
                                                    />
                                                </div>
                                                {fields.length > 1 && (
                                                    <Button type="button" variant="ghost" className="px-3" onClick={() => remove(index)}>
                                                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="button" variant="secondary" size="sm" onClick={() => append({ value: '' })} className="text-xs">
                                        <Plus className="w-3 h-3 mr-1" /> Add Requirement
                                    </Button>
                                </div>

                                <Input
                                    label="Tags / Skills (comma separated)"
                                    placeholder="React, TypeScript, Node.js"
                                    hint="Add 3-5 relevant skills"
                                    error={errors.tags?.message}
                                    {...register('tags')}
                                />
                            </div>
                        </div>

                        {/* STEP 3 */}
                        <div className={step === 3 ? 'block' : 'hidden'}>
                            <h2 className="text-xl font-bold text-black border-b border-gray-100 pb-4 mb-6">Availability Settings</h2>
                            <div className="space-y-6 max-w-sm">
                                <Input
                                    type="number"
                                    min="1"
                                    max="50"
                                    label="Number of Referral Slots"
                                    hint="How many candidates are you willing to refer for this role?"
                                    error={errors.slotsTotal?.message}
                                    {...register('slotsTotal')}
                                />
                            </div>
                        </div>

                        {/* STEP 4: REVIEW seamlessly pulling strictly from mapped outputs natively safely capturing components */}
                        <div className={step === 4 ? 'block' : 'hidden'}>
                            <h2 className="text-xl font-bold text-black border-b border-gray-100 pb-4 mb-6">Review & Publish</h2>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6">
                                <div>
                                    <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">Basic Info</h3>
                                    <p className="font-medium text-lg text-black">{formValues.jobTitle} <span className="text-gray-400 font-normal">at</span> {formValues.company}</p>
                                    <p className="text-sm text-gray-600 mt-1">{formValues.department} • {formValues.location} • <span className="capitalize">{formValues.workMode}</span></p>
                                </div>

                                <div className="w-full h-px bg-gray-200" />

                                <div>
                                    <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">Availability</h3>
                                    <div className="inline-flex items-center gap-2 border border-gray-200 bg-white px-3 py-1.5 rounded-md">
                                        <span className="font-bold text-black bg-gray-100 px-2 py-0.5 rounded">{formValues.slotsTotal}</span>
                                        <span className="text-sm text-gray-600 font-medium">Slots Offered</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NAV BAR */}
                        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                            {step > 1 ? (
                                <Button type="button" variant="ghost" onClick={() => setStep(s => s - 1)}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                            ) : <div />}

                            {step < 4 ? (
                                <Button type="button" onClick={handleNext}>
                                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button type="submit" isLoading={isSubmitting} className="shadow-md bg-black hover:bg-gray-800">
                                    Publish Listing
                                </Button>
                            )}
                        </div>

                    </form>
                </Card>
            </div>
        </DashboardLayout>
    );
};
