import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import { getNetworkInterfaces } from './getNetworkInterfaces.js';

describe('getNetworkInterfaces()', () => {
	it('should return an object', () => {
		const interfaces = getNetworkInterfaces();
		assert.strictEqual(typeof interfaces, 'object', 'Should return an object');
		assert.ok(interfaces !== null, 'Should not return null');
	});

	it('should be consistent with os.networkInterfaces()', () => {
		const ourResult = getNetworkInterfaces();
		const osResult = os.networkInterfaces();

		assert.deepStrictEqual(
			ourResult,
			osResult,
			'Should return same result as os.networkInterfaces()',
		);
	});

	it('should contain network interface information', () => {
		const interfaces = getNetworkInterfaces();
		const interfaceNames = Object.keys(interfaces);

		// Most systems should have at least one network interface
		assert.ok(
			interfaceNames.length > 0,
			'Should have at least one network interface',
		);
	});

	it('should have valid interface structures', () => {
		const interfaces = getNetworkInterfaces();

		Object.entries(interfaces).forEach(([name, interfaceList]) => {
			assert.strictEqual(
				typeof name,
				'string',
				`Interface name ${name} should be a string`,
			);
			assert.ok(
				Array.isArray(interfaceList),
				`Interface ${name} should have an array of configurations`,
			);

			interfaceList.forEach((iface, index) => {
				assert.strictEqual(
					typeof iface,
					'object',
					`Interface ${name}[${index}] should be an object`,
				);
				assert.ok(
					'address' in iface,
					`Interface ${name}[${index}] should have address property`,
				);
				assert.ok(
					'netmask' in iface,
					`Interface ${name}[${index}] should have netmask property`,
				);
				assert.ok(
					'family' in iface,
					`Interface ${name}[${index}] should have family property`,
				);
				assert.ok(
					'mac' in iface,
					`Interface ${name}[${index}] should have mac property`,
				);
				assert.ok(
					'internal' in iface,
					`Interface ${name}[${index}] should have internal property`,
				);
			});
		});
	});

	it('should have valid IP address formats', () => {
		const interfaces = getNetworkInterfaces();

		Object.entries(interfaces).forEach(([name, interfaceList]) => {
			interfaceList.forEach((iface, index) => {
				assert.strictEqual(
					typeof iface.address,
					'string',
					`Interface ${name}[${index}] address should be a string`,
				);
				assert.ok(
					iface.address.length > 0,
					`Interface ${name}[${index}] address should not be empty`,
				);

				// Check if it's a valid IP format (basic validation)
				if (iface.family === 'IPv4') {
					assert.ok(
						/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(iface.address),
						`Interface ${name}[${index}] should have valid IPv4 address format`,
					);
				} else if (iface.family === 'IPv6') {
					// IPv6 validation is more complex, just check it contains colons
					assert.ok(
						iface.address.includes(':'),
						`Interface ${name}[${index}] should have IPv6 address format with colons`,
					);
				}
			});
		});
	});

	it('should have valid netmask formats', () => {
		const interfaces = getNetworkInterfaces();

		Object.entries(interfaces).forEach(([name, interfaceList]) => {
			interfaceList.forEach((iface, index) => {
				assert.strictEqual(
					typeof iface.netmask,
					'string',
					`Interface ${name}[${index}] netmask should be a string`,
				);
				assert.ok(
					iface.netmask.length > 0,
					`Interface ${name}[${index}] netmask should not be empty`,
				);
			});
		});
	});

	it('should have valid family values', () => {
		const interfaces = getNetworkInterfaces();
		const validFamilies = ['IPv4', 'IPv6'];

		Object.entries(interfaces).forEach(([name, interfaceList]) => {
			interfaceList.forEach((iface, index) => {
				assert.ok(
					validFamilies.includes(iface.family),
					`Interface ${name}[${index}] family should be IPv4 or IPv6`,
				);
			});
		});
	});

	it('should have valid MAC address formats', () => {
		const interfaces = getNetworkInterfaces();

		Object.entries(interfaces).forEach(([name, interfaceList]) => {
			interfaceList.forEach((iface, index) => {
				assert.strictEqual(
					typeof iface.mac,
					'string',
					`Interface ${name}[${index}] MAC should be a string`,
				);

				// MAC address should be in format like "00:00:00:00:00:00" or similar
				if (iface.mac !== '00:00:00:00:00:00') {
					// Skip null MAC addresses
					assert.ok(
						/^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}$/.test(iface.mac),
						`Interface ${name}[${index}] should have valid MAC address format`,
					);
				}
			});
		});
	});

	it('should have valid internal boolean values', () => {
		const interfaces = getNetworkInterfaces();

		Object.entries(interfaces).forEach(([name, interfaceList]) => {
			interfaceList.forEach((iface, index) => {
				assert.strictEqual(
					typeof iface.internal,
					'boolean',
					`Interface ${name}[${index}] internal should be a boolean`,
				);
			});
		});
	});

	it('should typically include loopback interface', () => {
		const interfaces = getNetworkInterfaces();
		const interfaceNames = Object.keys(interfaces);

		// Most systems have a loopback interface (lo, lo0, or similar)
		const hasLoopback = interfaceNames.some(
			elementName =>
				elementName.toLowerCase().includes('lo') ||
				elementName.toLowerCase().includes('loopback'),
		);

		// Check if any interface has internal: true as an alternative
		const hasInternalInterface = Object.values(interfaces).some(interfaceList =>
			interfaceList.some(iface => iface.internal === true),
		);

		assert.ok(
			hasLoopback || hasInternalInterface,
			'Should have loopback interface or internal interface',
		);
	});

	it('should return consistent results on multiple calls', () => {
		const interfaces1 = getNetworkInterfaces();
		const interfaces2 = getNetworkInterfaces();

		assert.deepStrictEqual(
			interfaces1,
			interfaces2,
			'Should return consistent results across calls',
		);
	});

	it('should have unique interface names', () => {
		const interfaces = getNetworkInterfaces();
		const interfaceNames = Object.keys(interfaces);
		const uniqueNames = [...new Set(interfaceNames)];

		assert.strictEqual(
			interfaceNames.length,
			uniqueNames.length,
			'Interface names should be unique',
		);
	});
});
