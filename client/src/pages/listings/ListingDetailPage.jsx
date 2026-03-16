import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronRight, Share2, MapPin, Building, Briefcase, Clock, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { getListingById } from '../../api/listing.api';
import { createRequest } from '../../api/request.api';
import { useAuthStore } from '../../store/auth.store';
import { PageError } from '../../components/shared';
import { AppLayout } from '../../components/layout';
import { Button, Avatar, Badge, Card, Modal, Input, Textarea, Skeleton } from '../../components/ui';

const applySchema = z.object({
    coverNote: z.string().min(50, 'Please write at least 50 characters').max(500, 'Warning: Max 500 characters allowed'),
    linkedinUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    resumeUrl: z.string().url('Please enter a valid URL').optional().or(z.literal(''))
});

export const ListingDetailPage = () => {
    const { id } = useParams();
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [applySuccess, setApplySuccess] = useState(false);

    const { isAuthed, user } = useAuthStore();

    const { data: response, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['listing', id],
        queryFn: () => getListingById(id),
        enabled: !!id
    });

    const listing = response?.data?.listing;
    const isOwner = user?._id === listing?.referrer?._id || user?._id === listing?.referrer;
    const hasApplied = false; // This still needs a real check from back-end if we have a my-applications endpoint

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(applySchema)
    });

    const coverNote = watch('coverNote', '');

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        // Real implementation would show a toast here mapping perfectly
    };

    const applyMutation = useMutation({
        mutationFn: (data) => createRequest({ listing: id, ...data }),
        onSuccess: () => {
            setApplySuccess(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#000000', '#444444', '#aaaaaa', '#ffffff']
            });
            toast.success("Application submitted successfully!");
        }
    });

    const handleApply = (data) => {
        applyMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-pulse">
                    <Skeleton height={32} width="40%" className="mb-8" />
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="flex-1 space-y-6">
                            <Skeleton height={300} rounded="xl" />
                            <Skeleton height={200} rounded="xl" />
                        </div>
                        <div className="w-full lg:w-[380px]">
                            <Skeleton height={400} rounded="xl" />
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (isError) {
        return (
            <AppLayout>
                <PageError error={error} onRetry={refetch} />
            </AppLayout>
        );
    }

    if (!listing) return null;

    return (
        <AppLayout>
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center text-sm font-medium text-gray-500 gap-2">
                        <Link to="/" className="hover:text-black transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link to="/listings" className="hover:text-black transition-colors">Listings</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 truncate">{listing.company}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Main Content Pane */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-mono font-bold text-gray-500 text-lg border border-gray-200 shadow-sm">
                                    {listing.company.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 leading-none">{listing.company}</h2>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <Badge variant="default" size="sm" className="capitalize border-gray-200">{listing.workMode}</Badge>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-sm font-medium text-gray-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {listing.location}</span>
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-6">{listing.jobTitle}</h1>

                            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <Briefcase className="w-4 h-4 text-gray-400" /> {listing.department}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <Clock className="w-4 h-4 text-gray-400" /> Posted on {new Date(listing.createdAt).toLocaleDateString()}
                                </div>
                                {listing.jobUrl && (
                                    <a href={listing.jobUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-black font-semibold hover:underline">
                                        <FileText className="w-4 h-4" /> View Original Job Post
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">About the Role</h3>
                            <p className="text-gray-700 leading-relaxed mb-8 whitespace-pre-line">{listing.description}</p>

                            <h3 className="text-lg font-bold text-gray-900 mb-4">You should have...</h3>
                            <ul className="space-y-3 mb-8">
                                {listing.requirements.map((req, idx) => (
                                    <li key={idx} className="flex gap-3 text-gray-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                                        <span className="leading-relaxed">{req}</span>
                                    </li>
                                ))}
                            </ul>

                            <h3 className="text-lg font-bold text-gray-900 mb-4">Tech & Skills</h3>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {listing.tags.map(tag => (
                                    <Badge key={tag}>{tag}</Badge>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                <Button variant="ghost" onClick={handleShare}>
                                    <Share2 className="w-4 h-4 mr-2" /> Share this listing
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Right Sidebar Mapping Strictly  */}
                    <div className="w-full lg:w-[380px] flex-shrink-0">
                        <div className="sticky top-24 space-y-6">

                            {/* Referrer Profile Card natively tracking grid mapping */}
                            <Card padding="md" className="border-t-4 border-t-black shadow-md">
                                <div className="flex items-start gap-4 mb-4">
                                    <Avatar src={listing.referrer.avatar?.url} name={listing.referrer.name} size="lg" className="border border-gray-100 shadow-sm" />
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/profile/${listing.referrer._id}`} className="hover:underline">
                                            <h3 className="font-bold text-lg text-gray-900 truncate tracking-tight">{listing.referrer.name}</h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 leading-tight mt-0.5">{listing.referrer.headline}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <span className="font-mono text-2xl font-bold text-black tracking-tighter">{listing.referrer.successfulReferrals}</span>
                                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">Successful</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center text-center border-l border-gray-200">
                                        <span className="font-mono text-2xl font-bold text-black tracking-tighter">{listing.referrer.rating.toFixed(1)}</span>
                                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1 pl-2">Avg Rating</span>
                                    </div>
                                </div>

                                <div className="mb-6 space-y-2">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-gray-900">{listing.slotsAvailable} slots available</span>
                                        <span className="text-gray-500">of {listing.slotsTotal}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-black rounded-full"
                                            style={{ width: `${Math.round(((listing.slotsTotal - listing.slotsAvailable) / listing.slotsTotal) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {isOwner ? (
                                    <Button disabled className="w-full" size="lg">This is your listing.</Button>
                                ) : hasApplied ? (
                                    <Button disabled className="w-full bg-gray-100 text-black border-2 border-dashed border-gray-300 opacity-100" size="lg">
                                        <CheckCircle2 className="w-5 h-5 mr-2 text-black" /> Request Submitted
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full text-base font-bold shadow-md shadow-black/10 hover:shadow-black/20"
                                        size="lg"
                                        onClick={() => isAuthed ? setIsApplyModalOpen(true) : alert('Go to login')}
                                    >
                                        Apply for Referral
                                    </Button>
                                )}

                                <p className="text-center text-xs text-gray-400 mt-4 font-medium flex items-center justify-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> Closes automatically on {listing.expiresAt ? new Date(listing.expiresAt).toLocaleDateString() : 'Update'}
                                </p>
                            </Card>

                            {/* Trust Badge Natively explicit inside sidebar arrays mapping */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex items-start gap-3">
                                <Building className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                    This opportunity involves sending your resume directly to an employee at <strong className="text-black font-semibold">{listing.company}</strong>. Ensure your pitch is well-crafted.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Strict Apply View Frame Modals parsed directly natively mapping securely */}
            <Modal isOpen={isApplyModalOpen} onClose={() => { setIsApplyModalOpen(false); setApplySuccess(false); }} size="lg" title="Send Referral Request">
                <AnimatePresence mode="wait">
                    {!applySuccess ? (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit(handleApply)}
                            className="space-y-6"
                        >
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 flex gap-4 items-center">
                                <Avatar src={listing.referrer.avatar?.url} name={listing.referrer.name} size="md" className="border shadow-sm border-gray-100" />
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Pitching to</p>
                                    <p className="font-bold text-gray-900">{listing.referrer.name} — {listing.jobTitle}</p>
                                </div>
                            </div>

                            <div>
                                <Textarea
                                    label="Cover Note"
                                    placeholder={`Hi ${listing.referrer.name.split(' ')[0]}, I'd love to be considered for the ${listing.jobTitle} position because...`}
                                    rows={5}
                                    error={errors.coverNote?.message}
                                    {...register('coverNote')}
                                />
                                <div className={`text-xs mt-1 text-right font-medium ${coverNote.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {coverNote.length} / 500
                                </div>
                            </div>

                            <Input
                                label="LinkedIn Profile (Optional)"
                                placeholder="https://linkedin.com/in/username"
                                error={errors.linkedinUrl?.message}
                                {...register('linkedinUrl')}
                            />

                            <Input
                                label="Portfolio / Resume Link (Optional)"
                                placeholder="https://your-portfolio.com or Drive link"
                                error={errors.resumeUrl?.message}
                                {...register('resumeUrl')}
                            />

                            <div className="pt-4 flex gap-3 border-t border-gray-100 mt-6">
                                <Button variant="ghost" type="button" onClick={() => setIsApplyModalOpen(false)} className="flex-1">Cancel</Button>
                                <Button type="submit" isLoading={applyMutation.isPending} className="flex-1 shadow-sm">Submit Request</Button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2 border-4 border-green-100">
                                <motion.svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </motion.svg>
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Request Sent Successfully!</h3>
                            <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
                                {listing.referrer.name} will review your profile shortly. You will be notified when they respond.
                            </p>
                            <Button onClick={() => setIsApplyModalOpen(false)} variant="secondary" className="mt-6 px-8 shadow-sm">
                                Got it
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Modal>

        </AppLayout>
    );
};
