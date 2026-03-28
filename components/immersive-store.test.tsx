import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { ImmersiveStore } from '@/components/immersive-store';

describe('ImmersiveStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('increments quantity and exposes a structured WhatsApp checkout link', async () => {
    const user = userEvent.setup();

    render(<ImmersiveStore />);

    const cartButton = screen.getByRole('button', { name: 'Abrir carrito' });

    expect(cartButton.textContent).toContain('0');

    await user.click(screen.getByRole('button', { name: 'Seleccionar pack de 6 unidades para Cubanito Clasico' }));
    await user.click(screen.getByRole('button', { name: 'Agregar Cubanito Clasico al carrito' }));
    await user.click(screen.getByRole('button', { name: 'Agregar Cubanito Clasico al carrito' }));

    expect(cartButton.textContent).toContain('2');
    expect(screen.getByText('En carrito x2')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Abrir modal de reserva' }));
    await user.type(screen.getByLabelText('Nombre'), 'Braian');
    await user.type(screen.getByLabelText('Direccion o punto de retiro'), 'La Plata centro');
    await user.type(screen.getByLabelText('Fecha de retiro'), 'Sabado 18:00');
    await user.type(screen.getByLabelText('Notas extra'), 'Sin azucar glass y caja para regalo');

    const checkoutLink = screen.getByRole('link', { name: 'Confirmar reserva por WhatsApp' });

    expect(checkoutLink.getAttribute('href')).toContain('https://wa.me/2215047962?text=');
    expect(decodeURIComponent(checkoutLink.getAttribute('href') ?? '')).toContain('2x Cubanito Clasico x6');
    expect(decodeURIComponent(checkoutLink.getAttribute('href') ?? '')).toContain('Nombre:* Braian');
    expect(decodeURIComponent(checkoutLink.getAttribute('href') ?? '')).toContain('Direccion:* La Plata centro');
    expect(decodeURIComponent(checkoutLink.getAttribute('href') ?? '')).toContain('Fecha de retiro:* Sabado 18:00');
    expect(decodeURIComponent(checkoutLink.getAttribute('href') ?? '')).toContain('Notas extra:* Sin azucar glass y caja para regalo');

    await waitFor(() => {
      expect(window.localStorage.getItem('cubanitos-dulces-cart')).toContain('"quantity":2');
    });

    expect(window.localStorage.getItem('cubanitos-dulces-customer')).toContain('Braian');
    expect(window.localStorage.getItem('cubanitos-dulces-customer')).toContain('Sin azucar glass y caja para regalo');
  }, 15000);

  it('restores the cart from localStorage on reload', async () => {
    window.localStorage.setItem(
      'cubanitos-dulces-cart',
      JSON.stringify([
        {
          id: 'signature-12',
          productId: 'signature',
          name: 'Neon Signature Box x12',
          price: 5200,
          quantity: 3,
          packSize: 12,
          packLabel: 'x12 u $5.200',
        },
      ]),
    );

    render(<ImmersiveStore />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Abrir carrito' }).textContent).toContain('3');
    });

    expect(screen.getByText('En carrito x3')).toBeTruthy();
  });

  it('lets the user edit quantities inside the cart modal', async () => {
    const user = userEvent.setup();

    render(<ImmersiveStore />);

    await user.click(screen.getByRole('button', { name: 'Agregar Neon Signature Box al carrito' }));
    await user.click(screen.getByRole('button', { name: 'Abrir modal de reserva' }));
    await user.click(screen.getByRole('button', { name: 'Sumar cantidad de Neon Signature Box x12' }));
    await user.click(screen.getByRole('button', { name: 'Restar cantidad de Neon Signature Box x12' }));

    expect(screen.getByRole('button', { name: 'Abrir carrito' }).textContent).toContain('1');

    await user.click(screen.getByRole('button', { name: 'Eliminar Neon Signature Box x12 del carrito' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Abrir carrito' }).textContent).toContain('0');
    });
  });
});