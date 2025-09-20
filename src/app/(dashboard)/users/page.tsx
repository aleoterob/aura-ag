import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: "Ale",
      email: "ale@example.com",
      role: "Admin",
      status: "Activo",
    },
    {
      id: 2,
      name: "María",
      email: "maria@example.com",
      role: "Usuario",
      status: "Activo",
    },
    {
      id: 3,
      name: "Juan",
      email: "juan@example.com",
      role: "Editor",
      status: "Inactivo",
    },
    {
      id: 4,
      name: "Ana",
      email: "ana@example.com",
      role: "Usuario",
      status: "Activo",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button>Agregar Usuario</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {users.length} usuarios registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={user.status === "Activo" ? "default" : "secondary"}
                  >
                    {user.status}
                  </Badge>
                  <Badge variant="outline">{user.role}</Badge>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
