import { useState, useEffect } from 'react';
import {
	ChakraProvider,
	Box,
	Input,
	Flex,
	Button,
	Grid,
	GridItem,
	Text,
	extendTheme,
	IconButton,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Switch,
	Heading,
	Stack,
	StackDivider,
	CardBody,
	Card,
	CardHeader,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { FaTwitch, FaYoutube, FaGithub } from 'react-icons/fa';

const theme = extendTheme({
	config: {
		initialColorMode: 'dark',
		useSystemColorMode: false,
	},
});

function App() {
	const [pinatas, setPinatas] = useState([]);
	const [filteredPinatas, setFilteredPinatas] = useState([]);
	const [selectedPinata, setSelectedPinata] = useState(null);
	const [showTricks, setShowTricks] = useState(false);
	const [showNotes, setShowNotes] = useState(false);
	useEffect(() => {
		fetch('updated_data.json')
			.then((response) => response.json())
			.then((data) => {
				setPinatas(data);
				setFilteredPinatas(data);
			});
	}, []);

	const handleSearch = (event) => {
		const query = event.target.value.toLowerCase();
		const filtered = pinatas.filter((pinata) => {
			return Object.entries(pinata).some(([key, value]) => {
				if (!showTricks && key.toLowerCase().includes('trick')) {
					return false;
				}
				if (!showNotes && key === 'Notes') {
					return false;
				}
				return value.toString().toLowerCase().includes(query);
			});
		});
		setFilteredPinatas(filtered);
	};

	const toggleTricks = () => setShowTricks(!showTricks);
	const toggleNotes = () => setShowNotes(!showNotes);

	return (
		<ChakraProvider theme={theme}>
			<Grid templateColumns={{ md: '2fr 1fr' }} gap={4} p={4}>
				<GridItem>
					<Input placeholder="Search Pinatas" onChange={handleSearch} mb={4} />
					<Flex wrap="wrap">
						{filteredPinatas.map((pinata) => (
							<Button
								key={pinata.Name}
								m={2}
								onClick={() => setSelectedPinata(pinata)}
								variant="outline"
							>
								{pinata.Name}
							</Button>
						))}
					</Flex>
				</GridItem>
				<GridItem>
					{selectedPinata && (
						<Card>
							<CardHeader>
								<Flex justify="space-between" align="center">
									<Heading size="md">{selectedPinata.Name}</Heading>
									<Text fontSize="sm">🟡 {selectedPinata.Cost}</Text>
								</Flex>
							</CardHeader>
							<CardBody>
								<Stack divider={<StackDivider />} spacing="4">
									{Object.entries(selectedPinata).map(([key, value]) => {
										if (
											key === 'Name' ||
											key === 'Cost' ||
											key === 'Related' ||
											(!showTricks && key.toLowerCase().includes('trick')) ||
											(!showNotes && key === 'Notes')
										) {
											return null;
										}

										return (
											<Box key={key}>
												<Heading size="xs" textTransform="uppercase">
													{key}
												</Heading>
												{Array.isArray(value) ? (
													value.map((item, index) => (
														<Text key={index} pt="2" fontSize="sm">
															{item}
														</Text>
													))
												) : (
													<Text pt="2" fontSize="sm">
														{value}
													</Text>
												)}
											</Box>
										);
									})}
								</Stack>
							</CardBody>
						</Card>
					)}
					{selectedPinata && selectedPinata.Related && (
						<Box mt={4}>
							<Text fontSize="lg" fontWeight="bold" mb={2}>
								Related Pinatas:
							</Text>
							<Flex wrap="wrap">
								{selectedPinata.Related.map((relatedName) => {
									const relatedPinata = pinatas.find(
										(p) => p.Name === relatedName
									);
									return (
										<Button
											key={relatedName}
											m={2}
											onClick={() => setSelectedPinata(relatedPinata)}
											variant="outline"
										>
											{relatedName}
										</Button>
									);
								})}
							</Flex>
						</Box>
					)}
				</GridItem>
			</Grid>
			<Box position="fixed" bottom="4" right="4">
				<Menu>
					<MenuButton
						as={IconButton}
						aria-label="Options"
						icon={<SettingsIcon />}
						variant="outline"
					/>
					<MenuList>
						<MenuItem>
							Show Tricks
							<Switch ml="3" isChecked={showTricks} onChange={toggleTricks} />
						</MenuItem>
						<MenuItem>
							Show Notes
							<Switch ml="3" isChecked={showNotes} onChange={toggleNotes} />
						</MenuItem>
					</MenuList>
				</Menu>
			</Box>
			<Box position="fixed" bottom="4" left="4">
				<a
					href="https://www.twitch.tv/MisterStealYourGil"
					target="_blank"
					rel="noopener noreferrer"
				>
					<IconButton icon={<FaTwitch />} aria-label="Twitch" size="sm" m={1} />
				</a>
				<a
					href="https://www.youtube.com/channel/UCnpj6ufdf5FjJWxVCm29rug"
					target="_blank"
					rel="noopener noreferrer"
				>
					<IconButton
						icon={<FaYoutube />}
						aria-label="YouTube"
						size="sm"
						m={1}
					/>
				</a>
				<a
					href="https://github.com/NTumminaro/VP-TiP-Quick-Search"
					target="_blank"
					rel="noopener noreferrer"
				>
					<IconButton icon={<FaGithub />} aria-label="GitHub" size="sm" m={1} />
				</a>
			</Box>
		</ChakraProvider>
	);
}

export default App;
