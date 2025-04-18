import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Meal from '@/models/Meal';
import mongoose from 'mongoose';

// Função auxiliar para validar ID do MongoDB
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/meals/[id] - Obter uma refeição específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    await dbConnect();

    const { id } = await Promise.resolve(params);

    // Validar ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Buscar refeição
    const meal = await Meal.findOne({ _id: id });

    // Verificar se a refeição existe
    if (!meal) {
      return NextResponse.json(
        { error: 'Refeição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(meal);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar refeição' },
      { status: 500 }
    );
  }
}

// PUT /api/meals/[id] - Atualizar uma refeição
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    await dbConnect();

    const { id } = params;

    // Validar ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Obter dados do corpo da requisição
    const data = await request.json();

    // Verificar se a refeição existe e pertence ao usuário
    const existingMeal = await Meal.findOne({ _id: id, userId: user.id });
    if (!existingMeal) {
      return NextResponse.json(
        { error: 'Refeição não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar refeição
    const meal = await Meal.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    // Verificar se a refeição existe
    if (!meal) {
      return NextResponse.json(
        { error: 'Refeição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(meal);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar refeição' },
      { status: 500 }
    );
  }
}

// DELETE /api/meals/[id] - Excluir uma refeição
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    await dbConnect();

    const { id } = await Promise.resolve(params);

    // Validar ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Verificar se a refeição existe
    const existingMeal = await Meal.findOne({ _id: id });
    if (!existingMeal) {
      return NextResponse.json(
        { error: 'Refeição não encontrada' },
        { status: 404 }
      );
    }

    // Excluir refeição
    const meal = await Meal.findByIdAndDelete(id);

    // Verificar se a refeição existe
    if (!meal) {
      return NextResponse.json(
        { error: 'Refeição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Refeição excluída com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir refeição' },
      { status: 500 }
    );
  }
}