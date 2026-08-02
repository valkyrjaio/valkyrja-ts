/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class ContainerServiceId {
    static readonly Contract = 'Valkyrja.Container.Manager.ContainerContract' as const;
    static readonly Data = 'Valkyrja.Container.Data.ContainerData' as const;
}
