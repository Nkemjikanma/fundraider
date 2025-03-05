"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateFundraiser() {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [goal, setGoal] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Add your form submission logic here
		// After successful creation, redirect to homepage
		router.push("/");
	};

	return (
		<div className="min-h-screen flex flex-col items-center max-w-md min-w-96 mx-auto p-4 bg-[#D5C0A0]">
			<Image src="/fundraider_logo.webp" width={100} height={100} alt="Fundraiser Logo" />

			<Card className="w-full mt-4">
				<CardHeader>
					<CardTitle>Create New Fundraiser</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="goal">Goal (ETH)</Label>
							<Input
								id="goal"
								type="number"
								step="0.01"
								value={goal}
								onChange={(e) => setGoal(e.target.value)}
								required
							/>
						</div>

						<div className="flex gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.push("/")}
								className="w-full"
							>
								Cancel
							</Button>
							<Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
								Create Fundraiser
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
